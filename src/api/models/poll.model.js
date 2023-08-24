/**
 *
 * Poll
 *
 */

const mongoose = require("mongoose");
const _omitBy = require("lodash/omitBy");
const { isNullorUndefined } = require("../utils/helpers");

const allFields = "title, options, courseId, createdBy";

const pollSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    options: {
      type: [Object],
      required: true,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

pollSchema.method({});

pollSchema.statics = {
  async list({
    page = 1,
    perPage = 30,
    date,
    fields = allFields,
    courseId,
    ...rest
  }) {
    const options = _omitBy(rest, (each) => isNullorUndefined(each));

    if (courseId && courseId != "null") {
      options["courseId"] = { $eq: courseId };
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

  async fetch(_id) {
    const poll = await this.findOne({ _id }).exec();
    return poll;
  },

  async updatePoll(id, updates) {
    updates = _omitBy(updates, (each) => isNullorUndefined(each));
    await this.updateOne({ _id: id }, updates).exec();
  },
};

module.exports = mongoose.model("Poll", pollSchema);
