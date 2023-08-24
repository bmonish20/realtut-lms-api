const ActivityFeed = require("../models/activityFeed.model");
const Notification = require("../models/notification.model");

const createActivity = (userId, activityType, description) => {
  ActivityFeed.create({
    userId,
    activityType,
    description,
  });
};

const sendNotification = (userId, title, description) => {
  Notification.create({
    status: "Unread",
    userId,
    title,
    description,
  });
};

module.exports = {
  createActivity,
  sendNotification,
};
