/**
 *
 * Course
 *
 */

const mongoose = require("mongoose");
const _omit = require("lodash/omit");
const _omitBy = require("lodash/omitBy");
const { isNullorUndefined } = require("../utils/helpers");
const APIError = require("../utils/APIError");
const httpStatus = require("http-status");
const moment = require("moment-timezone");

const allFields =
  "id title shortDescription startDate courseEndDate hostedBy description languages whatYouWillLearn prerequisite";

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    hostedBy: {
      type: String,
      required: true,
      ref: "User",
    },
    startDate: {
      type: Date,
      required: true,
    },
    duration: {
      type: Number,
    },
    shortDescription: {
      type: String,
      maxlength: 256,
    },
    description: {
      type: String,
    },
    languages: {
      type: [String],
    },
    tags: {
      type: [String],
    },
    chapters: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chapter",
      },
    ],
    quizzes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Quiz",
      },
    ],
    prerequisite: {
      type: String,
    },
    pictureUrl: {
      type: String,
    },
    courseEndDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

courseSchema.method({});

const userRegisteredvirtual = courseSchema.virtual("isUserRegistered", {
  ref: "EventRegistrations",
  localField: "_id",
  foreignField: "courseId",
  justOne: true,
});

courseSchema.virtual("totalForumMessages", {
  ref: "Forum",
  localField: "_id",
  foreignField: "courseId",
  count: true,
});

courseSchema.virtual("reviewedUsers", {
  ref: "CourseReview",
  localField: "_id",
  foreignField: "courseId",
});

courseSchema.virtual("userRating", {
  ref: "CourseReview",
  localField: "_id",
  foreignField: "rating",
  justOne: true,
});

courseSchema.virtual("registeredUsers", {
  ref: "EventRegistrations",
  localField: "_id",
  foreignField: "courseId",
  count: true,
});

const userReviewedvirtual = courseSchema.virtual("isUserReviewed", {
  ref: "CourseReview",
  localField: "_id",
  foreignField: "courseId",
  justOne: true,
});

userReviewedvirtual.getters.unshift((doc) => !!doc);
userRegisteredvirtual.getters.unshift((doc) => !!doc);

courseSchema.pre("save", async function save(next) {
  try {
    this.courseEndDate = moment(this.startDate).add(this.duration, "hours");
    return next();
  } catch (error) {
    return next(error);
  }
});

courseSchema.statics = {
  async list({
    page = 1,
    perPage = 30,
    date,
    endDate,
    fields = allFields,
    userId,
    ...rest
  }) {
    const options = _omitBy(rest, (each) => isNullorUndefined(each));

    if (date && date != "null") {
      options["courseEndDate"] = { $gte: date };
    }

    if (endDate && endDate != "null") {
      options["courseEndDate"] = { $lt: endDate };
    }

    if (fields && fields != "null") {
      fields = fields.replace(/,/g, " ");
    }

    return this.find(options, fields)
      .populate("hostedBy", "name picture")
      .populate({
        path: "isUserRegistered",
        match: { userId },
      })
      .populate("reviewedUsers")
      .populate({
        path: "isUserReviewed",
        match: { userId },
      })
      .populate("registeredUsers")
      .sort({ createdAt: -1 })
      .skip(perPage * (page - 1))
      .limit(perPage)
      .exec();
  },

  async fetch(_id) {
    let course = await this.findOne({ _id })
      .populate("hostedBy", "id name picture")
      .populate("chapters")
      .populate("reviewedUsers")
      .populate("totalForumMessages")
      .populate({ path: "quizzes", populate: { path: "questions" } })
      .exec();
    if (!course)
      throw new APIError({
        status: httpStatus.NOT_FOUND,
        message: "Course not found",
      });
    return course.toObject();
  },

  async updateCourse(id, updates) {
    updates = _omitBy(updates, (each) => isNullorUndefined(each));
    await this.updateOne({ _id: id }, updates).exec();
  },
};

module.exports = mongoose.model("Course", courseSchema);
