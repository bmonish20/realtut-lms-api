/**
 *
 * InviteUser
 *
 */

const httpStatus = require("http-status");
const InviteUser = require("../models/inviteUser.model");
const User = require("../models/user.model");
const emailProvider = require("../services/emails/emailProvider");

exports.list = async (req, res, next) => {
  try {
    const inviteUsers = await InviteUser.list(req.query);
    res.json(inviteUsers);
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      const inviteUser = new InviteUser({
        ...req.body,
        inviteSentBy: req.user._id,
      });
      const savedinviteUser = await inviteUser.save();
      emailProvider.sendInviteToUser(savedinviteUser);
      res.status(httpStatus.CREATED);
      res.json(savedinviteUser);
    } else {
      res.status(400).json({ message: "User already registered!" });
    }
  } catch (error) {
    next(error);
  }
};

exports.fetch = async (req, res, next) => {
  try {
    const { inviteUserId } = req.params;
    const inviteUser = await InviteUser.fetch(inviteUserId);
    res.json(inviteUser);
  } catch (error) {
    next(error);
  }
};

exports.updateOne = async (req, res, next) => {
  try {
    const { inviteUserId } = req.params;
    await InviteUser.updateInviteUser(inviteUserId, req.body);
    res.status(httpStatus.NO_CONTENT);
    res.send();
  } catch (error) {
    next(error);
  }
};

exports.removeOne = async (req, res, next) => {
  try {
    const { inviteUserId: _id } = req.params;
    await InviteUser.deleteOne({ _id });
    res.status(httpStatus.NO_CONTENT);
    res.send();
  } catch (error) {
    next(error);
  }
};
