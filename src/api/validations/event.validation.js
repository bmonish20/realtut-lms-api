const Joi = require("joi");

module.exports = {
  // POST v1/event
  createEvent: {
    body: {
      title: Joi.string().required(),
      type: Joi.string()
        .allow("instant", "scheduled", "recurring", "recurringWithFixedTime")
        .required(),
      dateTime: Joi.date().required(),
      shortDescription: Joi.string(),
      participants: Joi.string(),
      description: Joi.string(),
      tags: Joi.array().items(Joi.string()),
      imageUrl: Joi.string(),
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

  // GET /v1/event
  listEvents: {
    query: {
      page: Joi.number().min(1),
      perPage: Joi.number().min(1).max(100),
      date: Joi.alternatives([Joi.date(), Joi.string().valid("null")]),
      fields: Joi.string(),
    },
  },

  // GET /v1/event/:eventId
  fetchEvent: {
    params: {
      eventId: Joi.string().required(),
    },
  },

  // PATCH /v1/event/:eventId
  updateEvent: {
    params: {
      eventId: Joi.string().required(),
    },
    body: {
      title: Joi.string(),
      type: Joi.string().allow(
        "instant",
        "scheduled",
        "recurring",
        "recurringWithFixedTime"
      ),
      dateTime: Joi.date(),
      hostedBy: Joi.string(),
      hostedByPictureUrl: Joi.string(),
      shortDescription: Joi.string(),
      participants: Joi.string(),
      description: Joi.string(),
      webinarLink: Joi.string().required(),
      tags: Joi.array().items(Joi.string()),
      imageUrl: Joi.string(),
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

  // DELETE /v1/event/:eventId
  deleteEvent: {
    params: {
      eventId: Joi.string().required(),
    },
  },
};
