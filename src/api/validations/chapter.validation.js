/**
 *
 * Chapter
 *
 */

const Joi = require("joi");

module.exports = {
  // POST v1/chapter
  createChapter: {
    body: {
      title: Joi.string().required(),
      type: Joi.string()
        .allow("instant", "scheduled", "recurring", "recurringWithFixedTime")
        .required(),
      level: Joi.string().required(),
      tag: Joi.array(),
      dateTime: Joi.when("type", {
        is: "instant",
        then: Joi.allow(null),
        otherwise: Joi.allow(null),
      }),
      duration: Joi.number(),
      recurrence: Joi.when("type", {
        is: "recurringWithFixedTime",
        then: Joi.object({
          type: Joi.string().allow("daily", "weekly", "monthly").required(),
        }),
        otherwise: Joi.allow(null),
      }),
    },
  },

  // GET /v1/chapter
  listChapter: {
    query: {
      page: Joi.number().min(1),
      perPage: Joi.number().min(1).max(100),
      date: Joi.alternatives([Joi.date(), Joi.string().valid("null")]),
      fields: Joi.string(),
    },
  },

  // GET /v1/chapter/:chapterId
  fetchChapter: {
    params: {
      chapterId: Joi.string().required(),
    },
  },

  // PATCH /v1/chapter/:chapterId
  updateChapter: {
    params: {
      chapterId: Joi.string().required(),
    },
    body: {
      title: Joi.string(),
      type: Joi.string(),
      level: Joi.string(),
      link: Joi.string().required(),
      tag: Joi.array(),
    },
  },

  // DELETE /v1/chapter/:chapter
  deleteChapter: {
    params: {
      chapterId: Joi.string().required(),
    },
  },
};
