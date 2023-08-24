/**
 *
 * Course
 *
 */

const httpStatus = require("http-status");
const Course = require("../models/course.model");
const Registrations = require("../models/eventRegistrations.model");
const { createActivity } = require("../utils/activityAndNotificationHelpers");
const CourseReview = require("../models/courseReview.model");
const {
  populateAllMultimediaUrl,
  populateOneMultimediaUrl,
} = require("../utils/s3BucketHelpers");
const moment = require("moment-timezone");

exports.list = async (req, res, next) => {
  try {
    const courses = await Course.list({ ...req.query, userId: req.user._id });
    await populateAllMultimediaUrl(courses, "course", "id", "pictureUrl");
    res.json(courses);
  } catch (error) {
    next(error);
  }
};

exports.my = async (req, res, next) => {
  try {
    const courses = await Registrations.myCourses({
      ...req.query,
      userId: req.user._id,
    });
    res.json(courses);
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const course = new Course({
      ...req.body,
      hostedBy: req.user._id,
    });
    const savedCourse = await course.save();
    createActivity(req.user._id, "course", `Created ${savedCourse.title}`);
    res.status(httpStatus.CREATED);
    res.json(savedCourse);
  } catch (error) {
    next(error);
  }
};

exports.fetch = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const course = await Course.fetch(courseId);
    const isRegistered = await Registrations.IsUserRegisteredToCourse({
      courseId,
      userId: req.user._id,
    });
    const isReviewed = await CourseReview.isUserReviewedCourse({
      courseId,
      userId: req.user._id,
    });
    var rating = 0;
    if (isReviewed) {
      rating = await CourseReview.latestUserRating({
        courseId,
        userId: req.user._id,
      });
    }
    const response = { ...course, isRegistered, isReviewed, ...rating };
    await populateOneMultimediaUrl(courseId, "course", response, "pictureUrl");
    res.json(response);
  } catch (error) {
    next(error);
  }
};

exports.updateOne = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    await Course.updateCourse(courseId, {
      ...req.body,
      courseEndDate: moment(req.body.startDate).add(req.body.duration, "hours"),
    });
    createActivity(req.user._id, "course", `Updated ${req.body.title}`);
    res.status(httpStatus.NO_CONTENT);
    res.send();
  } catch (error) {
    next(error);
  }
};

exports.removeOne = async (req, res, next) => {
  try {
    const { courseId: _id } = req.params;
    const course = await Course.fetch(_id);
    await Course.deleteOne({ _id });
    createActivity(req.user._id, "course", `Deleted ${course.title}`);
    res.status(httpStatus.NO_CONTENT);
    res.send();
  } catch (error) {
    next(error);
  }
};
