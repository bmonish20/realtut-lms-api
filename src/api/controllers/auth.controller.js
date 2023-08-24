const httpStatus = require("http-status");
const User = require("../models/user.model");
const RefreshToken = require("../models/refreshToken.model");
const PasswordResetToken = require("../models/passwordResetToken.model");
const EmailVerification = require("../models/emailVerification.model");
const Permissions = require("../models/permission.model");
const moment = require("moment-timezone");
const { jwtExpirationInterval } = require("../../config/vars");
const { omit } = require("lodash");
const APIError = require("../utils/APIError");
const emailProvider = require("../services/emails/emailProvider");

/**
 * Returns a formated object with tokens
 * @private
 */
function generateTokenResponse(user, accessToken) {
  const tokenType = "Bearer";
  const refreshToken = RefreshToken.generate(user).token;
  const expiresIn = moment().add(jwtExpirationInterval, "minutes");
  return {
    tokenType,
    accessToken,
    refreshToken,
    expiresIn,
  };
}

async function sendEmailVerification(user) {
  if (user) {
    const verificationObj = await EmailVerification.findOne({
      email: user.email,
    });
    if (!verificationObj) {
      const emaiVerifyObj = await EmailVerification.generate(user);
      emailProvider.sendEmailVerification(emaiVerifyObj);
      return;
    }
    const newVerificationObj = verificationObj.resetCode();
    emailProvider.sendEmailVerification(newVerificationObj);
    return;
  }
  throw new APIError({
    status: httpStatus.INTERNAL_SERVER_ERROR,
    message: "Unable to save user details",
  });
}

async function saveUser(newUser) {
  const userData = omit(newUser, "role");
  const user = await new User(userData).save();
  const userTransformed = user.transform();
  const token = generateTokenResponse(user, user.token());
  const permissions = await Permissions.fetchPermissions({ role: user.role });
  return { token, user: userTransformed, permissions };
}

/**
 * Returns jwt token if registration was successful
 * @public
 */
exports.register = async (req, res, next) => {
  try {
    const userData = omit(req.body, "role");
    const user = await User.findOne({
      email: userData.email,
    });
    if (user) {
      var err = {
        status: httpStatus.CONFLICT,
        message: "Email Address already exits. Please login",
      };
      throw new APIError(err);
    }

    await sendEmailVerification(userData);
    res.status(httpStatus.OK);
    return res.json("Verification email sent");
  } catch (error) {
    return next(error);
  }
};

exports.registerViaInvite = async (req, res, next) => {
  try {
    const userData = omit(req.body, "role");
    const user = await User.findOne({
      email: userData.email,
    });
    if (user) {
      var err = {
        status: httpStatus.CONFLICT,
        message: "Email Address already exits. Please login",
      };
      throw new APIError(err);
    }
    var response = await saveUser({
      email: userData.email,
      password: "123456798",
      name: userData.name,
    });

    const updatedUser = await User.findOne({ email: userData.email }).exec();

    if (updatedUser) {
      const passwordResetObj = await PasswordResetToken.generate(updatedUser);
      emailProvider.sendPasswordSettingLink(passwordResetObj);
    }

    res.status(httpStatus.OK);
    return res.json(response);
  } catch (error) {
    return next(error);
  }
};

/**
 * Returns jwt token if valid username and password is provided
 * @public
 */
exports.login = async (req, res, next) => {
  try {
    const { user, accessToken } = await User.findAndGenerateToken(req.body);
    if (!user.enabled)
      throw new APIError({
        message: "Your account has been disabled. Please contact Support.",
        status: httpStatus.FORBIDDEN,
      });
    const token = generateTokenResponse(user, accessToken);
    const userTransformed = user.transform();
    const permissions = await Permissions.fetchPermissions({
      role: user.role,
    });
    return res.json({ token, user: userTransformed, permissions });
  } catch (error) {
    return next(error);
  }
};

/**
 * login with an existing user or creates a new one if valid accessToken token
 * Returns jwt token
 * @public
 */
exports.oAuth = async (req, res, next) => {
  try {
    const { user } = req;
    if (!user.enabled)
      throw new APIError({
        message: "Your account has been disabled. Please contact Support.",
        status: httpStatus.FORBIDDEN,
      });
    const accessToken = user.token();
    const token = generateTokenResponse(user, accessToken);
    const userTransformed = user.transform();
    const permissions = await Permissions.fetchPermissions({
      role: user.role,
    });
    return res.json({ token, user: userTransformed, permissions });
  } catch (error) {
    return next(error);
  }
};

/**
 * Returns a new jwt when given a valid refresh token
 * @public
 */
exports.refresh = async (req, res, next) => {
  try {
    const { email, refreshToken } = req.body;
    const refreshObject = await RefreshToken.findOneAndRemove({
      userEmail: email,
      token: refreshToken,
    });
    const { user, accessToken } = await User.findAndGenerateToken({
      email,
      refreshObject,
    });
    const response = generateTokenResponse(user, accessToken);
    return res.json(response);
  } catch (error) {
    return next(error);
  }
};

exports.sendPasswordReset = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email }).exec();

    if (user) {
      const passwordResetObj = await PasswordResetToken.generate(user);
      emailProvider.sendPasswordReset(passwordResetObj);
      res.status(httpStatus.OK);
      return res.json("success");
    }
    throw new APIError({
      status: httpStatus.UNAUTHORIZED,
      message: "No account found with that email",
    });
  } catch (error) {
    return next(error);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const { email, password, resetToken } = req.body;
    const resetTokenObject = await PasswordResetToken.findOneAndRemove({
      userEmail: email,
      resetToken,
    });

    const err = {
      status: httpStatus.UNAUTHORIZED,
      isPublic: true,
    };
    if (!resetTokenObject) {
      err.message = "Cannot find matching reset token";
      throw new APIError(err);
    }
    if (moment().isAfter(resetTokenObject.expires)) {
      err.message = "Reset token is expired";
      throw new APIError(err);
    }

    const user = await User.findOne({
      email: resetTokenObject.userEmail,
    }).exec();
    user.password = password;
    await user.save();
    emailProvider.sendPasswordChangeEmail(user);

    res.status(httpStatus.OK);
    return res.json("Password Updated");
  } catch (error) {
    return next(error);
  }
};

exports.resendEmailVerification = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await EmailVerification.findOne({ userEmail: email }).exec();
    if (!user) {
      const err = {
        status: httpStatus.BAD_REQUEST,
        message: "Email id not registered. Please register again",
      };
      throw new APIError(err);
    }
    const updatedObj = user.resetCode();
    emailProvider.sendEmailVerification(updatedObj);
    return res.json("Email resent");
  } catch (error) {
    return next(error);
  }
};

exports.emailVerification = async (req, res, next) => {
  try {
    const { email, code } = req.body;
    const verificationObj = await EmailVerification.findOne({
      userEmail: email,
      code,
    });
    const err = {
      status: httpStatus.UNAUTHORIZED,
      isPublic: true,
    };
    if (!verificationObj) {
      err.message = "Entered verification is invalid";
      throw new APIError(err);
    }
    if (moment().isAfter(verificationObj.expires)) {
      err.message = "Verification code has expired";
      throw new APIError(err);
    }

    var { userEmail, password, name, yearsOfExpeirence, techstack } =
      verificationObj;

    var response = await saveUser({
      email: userEmail,
      password,
      name,
      yearsOfExpeirence,
      techstack,
    });

    await EmailVerification.deleteOne({ userEmail: email, code });

    res.status(httpStatus.CREATED);
    return res.json(response);
  } catch (err) {
    return next(err);
  }
};
