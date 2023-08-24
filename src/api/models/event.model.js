const mongoose = require("mongoose");
const moment = require("moment-timezone");
const _omit = require("lodash/omit");
const _omitBy = require("lodash/omitBy");
const httpStatus = require("http-status");
const APIError = require("../utils/APIError");
const { isNullorUndefined } = require("../utils/helpers");
const {
  webinar: { linkActivationLimit },
} = require("../../config/vars");

const allFields =
  "id title type dateTime hostedBy hostedByPictureUrl shortDescription description tags participants";

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    dateTime: {
      type: Date,
      required: true,
    },
    hostedBy: {
      type: String,
      required: true,
      ref: "User",
    },
    shortDescription: {
      type: String,
      maxlength: 256,
    },
    participants: {
      type: String,
    },
    description: {
      type: String,
    },
    webinarLink: {
      type: String,
      required: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    imageUrl: {
      type: String,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

eventSchema.virtual("registeredUsers", {
  ref: "EventRegistrations",
  localField: "_id",
  foreignField: "eventId",
  count: true,
});

const userRegisteredvirtual = eventSchema.virtual("isUserRegistered", {
  ref: "EventRegistrations",
  localField: "_id",
  foreignField: "eventId",
  justOne: true,
});

userRegisteredvirtual.getters.unshift((doc) => !!doc);

eventSchema.statics = {
  async list({
    page = 1,
    perPage = 30,
    date,
    endDate,
    fields = allFields,
    userId,
    sidebarStartDate,
    sidebarEndDate,
    ...rest
  }) {
    const options = _omitBy(rest, (each) => isNullorUndefined(each));

    if (date && date != "null") {
      options["dateTime"] = { $gte: date };
    }

    if (endDate && endDate != null) {
      options["dateTime"] = { $lt: endDate };
    }

    if (
      sidebarStartDate &&
      sidebarStartDate != "null" &&
      sidebarEndDate &&
      sidebarEndDate != "null"
    ) {
      options["dateTime"] = { $gte: sidebarStartDate, $lt: sidebarEndDate };
    }

    if (fields && fields != "null") {
      fields = fields.replace(/,/g, " ");
    }

    return this.find(options, fields)
      .populate("registeredUsers hostedBy", "name picture")
      .populate({
        path: "isUserRegistered",
        match: { userId },
      })
      .sort({ dateTime: 1 })
      .skip(perPage * (page - 1))
      .limit(perPage)
      .exec();
  },

  async fetch({ id, role = "user" }) {
    let event = await this.findOne({ _id: id })
      .populate("registeredUsers hostedBy", "name picture")
      .exec();
    if (!event)
      throw new APIError({
        status: httpStatus.NOT_FOUND,
        message: "Event not found",
      });
    if (
      role == "user" &&
      moment().add(linkActivationLimit, "hours").isBefore(event.dateTime)
    ) {
      event = _omit(event.toObject(), ["webinarLink"]);
      return event;
    }
    return event.toObject();
  },

  async updateEvent({ id }, updates) {
    updates = _omitBy(updates, (each) => isNullorUndefined(each));
    await this.updateOne({ _id: id }, updates).exec();
  },
};

module.exports = mongoose.model("Event", eventSchema);
