/**
 *
 * CourseReview
 *
 */

const mongoose = require("mongoose");
const _omitBy = require("lodash/omitBy");
const { isNullorUndefined } = require("../utils/helpers");

const allFields = "courseId userId rating";

const courseReviewSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

courseReviewSchema.method({});

courseReviewSchema.statics = {
  async list({ page = 1, perPage = 30, date, fields = allFields }) {
    const options = {};

    if (date && date != "null") {
      options["dateTime"] = { $gte: date };
    }

    if (fields && fields != "null") {
      fields = fields.replace(/,/g, " ");
    }

    return this.find(options, fields)
      .populate({
        path: "courseId",
        select: "title",
        populate: {
          path: "hostedBy",
          select: "name",
        },
      })
      .populate({
        path: "",
      })
      .populate("userId", "name email phoneNumber")
      .sort({ createdAt: -1 })
      .skip(perPage * (page - 1))
      .limit(perPage)
      .exec();
  },

  async isUserReviewedCourse({ courseId, userId }) {
    const course = await this.findOne({ $and: [{ courseId }, { userId }] });

    return !!course;
  },

  async latestUserRating({ courseId, userId }) {
    const { rating, _id } = await this.findOne({
      userId,
      courseId,
    }).sort({
      createdAt: -1,
    });

    return { rating, ratingId: _id };
  },

  async updateCourseReview(id, updates) {
    updates = _omitBy(updates, (each) => isNullorUndefined(each));
    await this.updateOne({ _id: id }, updates).exec();
  },
};

module.exports = mongoose.model("CourseReview", courseReviewSchema);
