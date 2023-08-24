/**
 *
 * Course
 *
 */

const Joi = require("joi");

module.exports = {
  // POST v1/course
  createCourse: {
    body: {
      title: Joi.string().required(),
      type: Joi.string().required(),
      startDate: Joi.date().required(),
      duration: Joi.number(),
      shortDescription: Joi.string(),
      description: Joi.string(),
      tags: Joi.array().items(Joi.string()),
    },
  },

  // GET /v1/course
  listCourse: {
    query: {
      page: Joi.number().min(1),
      perPage: Joi.number().min(1).max(100),
      date: Joi.alternatives([Joi.date(), Joi.string().valid("null")]),
      fields: Joi.string(),
    },
  },

  // GET /v1/course/:courseId
  fetchCourse: {
    params: {
      courseId: Joi.string().required(),
    },
  },

  // PATCH /v1/course/:courseId
  updateCourse: {
    params: {
      courseId: Joi.string().required(),
    },
    body: {
      // add collection fields here
    },
  },

  // DELETE /v1/course/:course
  deleteCourse: {
    params: {
      courseId: Joi.string().required(),
    },
  },

  // POST /v1/course/:courseId/register
  registerCourse: {
    params: {
      courseId: Joi.string().required(),
    },
  },

  // DELETE /v1/course/:courseId/register
  removeRegistration: {
    params: {
      courseId: Joi.string().required(),
    },
  },

  // POST /v1/event/:eventId/progress
  updateProgress: {
    params: {
      courseId: Joi.string().required(),
    },
    body: {
      courseProgress: Joi.number().required(),
    },
  },

  listRegistrations: {
    query: {
      page: Joi.number().min(1),
      perPage: Joi.number().min(1).max(100),
      date: Joi.alternatives([Joi.date(), Joi.string().valid("null")]),
      fields: Joi.string(),
    },
  },
};
