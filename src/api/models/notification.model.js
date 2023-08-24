/**
 *
 * Notification
 *
 */

const mongoose = require("mongoose");
const _omitBy = require("lodash/omitBy");
const { isNullorUndefined } = require("../utils/helpers");

const allFields = "title, description, status, createdAt";

const notificationSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: { type: String, default: "Unread" },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

notificationSchema.method({});

notificationSchema.statics = {
  async list(
    { page = 1, perPage = 30, date, fields = allFields, status },
    userId
  ) {
    const options = {};

    if (userId && userId != "null") {
      options["userId"] = userId;
    }

    if (status && status != "null") {
      options["status"] = status;
    }

    if (date && date != "null") {
      options["dateTime"] = { $gte: date };
    }

    if (fields && fields != "null") {
      fields = fields.replace(/,/g, " ");
    }

    return this.find(options, fields)
      .sort({ createdAt: -1 })
      .skip(perPage * (page - 1))
      .limit(perPage)
      .exec();
  },

  async unreadCount(
    { page = 1, perPage = 30, fields = allFields, status },
    userId
  ) {
    const options = {};

    if (userId && userId != "null") {
      options["userId"] = userId;
    }

    if (status && status != "null") {
      options["status"] = status;
    }

    if (fields && fields != "null") {
      fields = fields.replace(/,/g, " ");
    }

    return this.find(options, fields)
      .countDocuments({ status: "Unread" })
      .sort({ createdAt: -1 })
      .skip(perPage * (page - 1))
      .limit(perPage)
      .exec();
  },

  async fetch(_id) {
    const notification = await this.findOne({ _id }).exec();
    return notification;
  },

  async updateNotification(id, updates) {
    updates = _omitBy(updates, (each) => isNullorUndefined(each));
    await this.updateOne({ _id: id }, updates).exec();
  },
};

module.exports = mongoose.model("Notification", notificationSchema);
