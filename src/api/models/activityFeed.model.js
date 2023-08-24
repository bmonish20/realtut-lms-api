/**
 *
 * ActivityFeed
 *
 */

const mongoose = require("mongoose");

const allFields = "id activityType description createdAt";

const activityFeedSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    activityType: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

activityFeedSchema.method({});

activityFeedSchema.statics = {
  async list({ page = 1, perPage = 30, date, fields = allFields }, userId) {
    const options = {};
    if (userId && userId != "null") {
      options["userId"] = userId;
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
};

module.exports = mongoose.model("ActivityFeed", activityFeedSchema);
