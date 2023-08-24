/**
 *
 * CourseReview
 *
 */

const Joi = require("joi");

module.exports = {
  // POST v1/course/:courseId/review
  review: {
    params: {
      courseId: Joi.string().required(),
    },
  },

  listReviews: {
    query: {
      page: Joi.number().min(1),
      perPage: Joi.number().min(1).max(100),
      date: Joi.alternatives([Joi.date(), Joi.string().valid("null")]),
      fields: Joi.string(),
    },
  },

  // PATCH v1/course/:courseReviewId/review
  updateReview: {
    params: {
      courseReviewId: Joi.string().required(),
    },
  },
};
