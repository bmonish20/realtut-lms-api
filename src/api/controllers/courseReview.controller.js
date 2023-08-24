/**
 *
 * CourseReview
 *
 */

const httpStatus = require("http-status");
const CourseReview = require("../models/courseReview.model");

exports.list = async (req, res, next) => {
  try {
    const reviews = await CourseReview.list(req.query);
    res.json(reviews);
  } catch (error) {
    next(error);
  }
};

exports.review = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const review = new CourseReview({
      ...req.body,
      courseId,
      userId: req.user._id,
    });

    await review.save();
    res.status(httpStatus.NO_CONTENT);
    res.send();
  } catch (error) {
    next(error);
  }
};

exports.updateOne = async (req, res, next) => {
  try {
    const { courseReviewId } = req.params;
    await CourseReview.updateCourseReview(courseReviewId, req.body);
    res.status(httpStatus.NO_CONTENT);
    res.send();
  } catch (error) {
    next(error);
  }
};
