/**
 *
 * EventRegistrations
 *
 */

const mongoose = require("mongoose");

const allFields = "eventId userId courseId courseProgress";

const eventRegistrationsSchema = new mongoose.Schema(
  {
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
    courseProgress: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

eventRegistrationsSchema.statics = {
  async listEnrolledCourses({
    page = 1,
    perPage = 30,
    date,
    fields = allFields,
  }) {
    const options = {};

    if (date && date != "null") {
      options["dateTime"] = { $gte: date };
    }

    if (fields && fields != "null") {
      fields = fields.replace(/,/g, " ");
    }
    return this.find({ ...options, courseId: { $exists: true } }, fields)
      .populate({
        path: "courseId",
        select: "startDate chapters courseEndDate title",
        populate: {
          path: "quizzes",
        },
      })
      .populate("userId", "name email phoneNumber")
      .sort({ createdAt: -1 })
      .skip(perPage * (page - 1))
      .limit(perPage)
      .exec();
  },

  async IsUserRegisteredToEvent({ eventId, userId }) {
    const event = await this.findOne({ $and: [{ eventId }, { userId }] });
    return !!event;
  },

  async IsUserRegisteredToCourse({ courseId, userId }) {
    const event = await this.findOne({ $and: [{ courseId }, { userId }] });
    return !!event;
  },

  async myCourses({ userId, fields }) {
    if (fields && fields != "null") {
      fields = fields.replace(/,/g, " ");
    }
    return this.find({ userId, courseId: { $ne: null } }, fields)
      .populate({
        path: "courseId",
        populate: { path: "hostedBy", select: "id name link" },
      })
      .populate({
        path: "courseId",
        populate: { path: "chapters", select: "title dateTime" },
      })
      .exec();
  },

  async updateCourseProgress({ userId, courseId, courseProgress }) {
    await this.updateOne({ userId, courseId }, { courseProgress }).exec();
  },
};

module.exports = mongoose.model("EventRegistrations", eventRegistrationsSchema);
