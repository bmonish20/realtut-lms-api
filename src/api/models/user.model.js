const mongoose = require("mongoose");
const httpStatus = require("http-status");
const { omitBy, isNil } = require("lodash");
const bcrypt = require("bcryptjs");
const moment = require("moment-timezone");
const jwt = require("jwt-simple");
const uuidv4 = require("uuid/v4");
const APIError = require("../utils/APIError");
const { isNullorUndefined } = require("../utils/helpers");
const { env, jwtSecret, jwtExpirationInterval } = require("../../config/vars");

/**
 * User Roles
 */
const roles = ["user", "admin", "trainer"];

/**
 * User Schema
 * @private
 */
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      match: /^\S+@\S+\.\S+$/,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      maxlength: 128,
    },
    name: {
      type: String,
      maxlength: 128,
      index: true,
      trim: true,
    },
    role: {
      type: String,
      enum: roles,
      default: "user",
    },
    enabled: {
      type: Boolean,
      default: true,
    },
    yearsOfExpeirence: {
      type: Number,
      default: null,
    },
    techstack: {
      type: [String],
      default: [],
    },
    picture: {
      type: String,
    },
    firstName: {
      type: String,
      maxlength: 128,
      trim: true,
    },
    lastName: {
      type: String,
      maxlength: 128,
      trim: true,
    },
    phoneNumber: {
      type: String,
    },
    userName: {
      type: String,
      maxlength: 128,
      index: true,
      trim: true,
    },
    currentRole: {
      type: String,
      maxlength: 128,
      trim: true,
    },
    currentCompanyName: {
      type: String,
      maxlength: 128,
      trim: true,
    },
    bio: {
      type: String,
      maxlength: 256,
      trim: true,
    },
    otherProfile: {
      websiteUrl: {
        type: String,
      },
      linkedInLink: {
        type: String,
      },
      githubLink: {
        type: String,
      },
      twitterLink: {
        type: String,
      },
    },
    collegeInfo: {
      graduationDate: {
        type: String,
      },
      university: {
        type: String,
        maxlength: 128,
      },
      major: {
        type: String,
        maxlength: 128,
      },
      degree: {
        type: String,
        maxlength: 128,
      },
      gpa: {
        type: Number,
        default: null,
      },
      max: {
        type: Number,
        default: null,
      },
    },
    companyInfo: {
      companyName: {
        type: String,
        maxlength: 128,
      },
      title: {
        type: String,
        maxlength: 128,
      },
      startDate: {
        type: String,
      },
      endDate: {
        type: String,
      },
      description: {
        type: String,
        maxlength: 256,
      },
      currentWorking: {
        type: Boolean,
        default: false,
      },
    },
    dashboardPreference: {
      task: {
        type: Boolean,
        default: true,
      },
      event: {
        type: Boolean,
        default: true,
      },
      calendar: {
        type: Boolean,
        default: true,
      },
      courseProgress: {
        type: Boolean,
        default: true,
      },
      popularCourses: {
        type: Boolean,
        default: true,
      },
      activityFeed: {
        type: Boolean,
        default: true,
      },
    },
    skills: {
      type: [String],
    },
    achievements: {
      type: String,
      maxlength: 500,
    },
    openToRoles: {
      type: [String],
    },
    resumeUrl: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */
userSchema.pre("save", async function save(next) {
  try {
    if (!this.isModified("password")) return next();

    const rounds = env === "test" ? 1 : 10;

    const hash = await bcrypt.hash(this.password, rounds);
    this.password = hash;

    return next();
  } catch (error) {
    return next(error);
  }
});

/**
 * Methods
 */
userSchema.method({
  transform() {
    const transformed = {};
    const fields = [
      "id",
      "name",
      "email",
      "role",
      "enabled",
      "yearsOfExpeirence",
      "techstack",
      "createdAt",
      "picture",
      "firstName",
      "lastName",
      "phoneNumber",
      "userName",
      "currentRole",
      "currentCompanyName",
      "bio",
      "companyInfo",
      "collegeInfo",
      "otherProfile",
      "skills",
      "achievements",
      "openToRoles",
      "resumeUrl",
      "dashboardPreference",
    ];

    fields.forEach((field) => {
      transformed[field] = this[field];
    });

    return transformed;
  },

  token() {
    const playload = {
      exp: moment().add(jwtExpirationInterval, "minutes").unix(),
      iat: moment().unix(),
      sub: this._id,
    };
    return jwt.encode(playload, jwtSecret);
  },

  async passwordMatches(password) {
    return bcrypt.compare(password, this.password);
  },
});

/**
 * Statics
 */
userSchema.statics = {
  roles,

  /**
   * Get user
   *
   * @param {ObjectId} id - The objectId of user.
   * @returns {Promise<User, APIError>}
   */
  async get(id) {
    try {
      let user;

      if (mongoose.Types.ObjectId.isValid(id)) {
        user = await this.findById(id).exec();
      }
      if (user) {
        return user;
      }

      throw new APIError({
        message: "User does not exist",
        status: httpStatus.NOT_FOUND,
      });
    } catch (error) {
      throw error;
    }
  },

  /**
   * Find user by email and tries to generate a JWT token
   *
   * @param {ObjectId} id - The objectId of user.
   * @returns {Promise<User, APIError>}
   */
  async findAndGenerateToken(options) {
    const { email, password, refreshObject } = options;
    if (!email)
      throw new APIError({
        message: "An email is required to generate a token",
      });

    const user = await this.findOne({ email }).exec();
    const err = {
      status: httpStatus.UNAUTHORIZED,
      isPublic: true,
    };
    if (password) {
      if (user && (await user.passwordMatches(password))) {
        return { user, accessToken: user.token() };
      }
      err.message = "Incorrect email or password";
    } else if (refreshObject && refreshObject.userEmail === email) {
      if (moment(refreshObject.expires).isBefore()) {
        err.message = "Invalid refresh token.";
      } else {
        return { user, accessToken: user.token() };
      }
    } else {
      err.message = "Incorrect email or refreshToken";
    }
    throw new APIError(err);
  },

  /**
   * List users in descending order of 'createdAt' timestamp.
   *
   * @param {number} skip - Number of users to be skipped.
   * @param {number} limit - Limit number of users to be returned.
   * @returns {Promise<User[]>}
   */
  list({ page = 1, perPage = 30, name, email, role, enabled, searchPattern }) {
    let options = omitBy({ name, email, role, enabled }, (each) =>
      isNullorUndefined(each)
    );
    if (!isNullorUndefined(searchPattern)) {
      options = {
        ...options,
        $or: [
          { name: { $regex: searchPattern, $options: "$i" } },
          { email: { $regex: searchPattern, $options: "$i" } },
          { phoneNumber: { $regex: searchPattern, $options: "$i" } },
        ],
      };
    }
    return this.find(options)
      .sort({ createdAt: -1 })
      .skip(perPage * (page - 1))
      .limit(perPage)
      .exec();
  },

  /**
   * Return new validation error
   * if error is a mongoose duplicate key error
   *
   * @param {Error} error
   * @returns {Error|APIError}
   */
  checkDuplicateEmail(error) {
    if (error.name === "MongoError" && error.code === 11000) {
      return new APIError({
        message: "Email already exists. Please Login",
        errors: [
          {
            field: "email",
            location: "body",
            messages: ['"email" already exists'],
          },
        ],
        status: httpStatus.CONFLICT,
        isPublic: true,
        stack: error.stack,
      });
    }
    return error;
  },

  async oAuthLogin({ service, id, email, name, picture }) {
    const user = await this.findOne({
      $or: [{ [`services.${service}`]: id }, { email }],
    });

    if (user) {
      if (!user.name) user.name = name;
      if (!user.picture) user.picture = picture;
      return user.save();
    }
    const password = uuidv4();
    return this.create({
      email,
      password,
      name,
      picture,
    });
  },
};

/**
 * @typedef User
 */
module.exports = mongoose.model("User", userSchema);
