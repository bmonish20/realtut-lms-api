/**
 *
 * Notification
 *
 */

const httpStatus = require("http-status");
const Notification = require("../models/notification.model");

exports.list = async (req, res, next) => {
  try {
    const notifications = await Notification.list(req.query, req.user._id);
    const notificationCount = await Notification.unreadCount(
      req.query,
      req.user._id
    );
    res.json({ notifications, notificationCount });
  } catch (error) {
    next(error);
  }
};

exports.updateOne = async (req, res, next) => {
  try {
    const { notificationId } = req.params;
    await Notification.updateNotification(notificationId, req.body);
    res.status(httpStatus.NO_CONTENT);
    res.send();
  } catch (error) {
    next(error);
  }
};
