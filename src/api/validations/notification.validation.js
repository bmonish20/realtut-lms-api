/**
 *
 * Notification
 *
 */

const Joi = require("joi");

module.exports = {
  // GET /v1/notification
  listNotification: {
    query: {
      page: Joi.number().min(1),
      perPage: Joi.number().min(1).max(100),
      date: Joi.alternatives([Joi.date(), Joi.string().valid("null")]),
      fields: Joi.string(),
    },
  },

  // PATCH /v1/notification/:notificationId
  updateNotification: {
    params: {
      notificationId: Joi.string().required(),
    },
    body: {
      status: Joi.string().required(),
    },
  },
};
