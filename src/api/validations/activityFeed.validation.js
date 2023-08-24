/**
*
* ActivityFeed
*
*/

const Joi = require('joi');

module.exports = {
  // POST v1/activityFeed
  createActivityFeed: {
    body: {
      activityType: Joi.string().required(),
    }
  },

  // GET /v1/activityFeed
  listActivityFeed: {
    query: {
      page: Joi.number().min(1),
      perPage: Joi.number().min(1).max(100),
      date: Joi.alternatives([Joi.date(), Joi.string().valid('null')]),
      fields: Joi.string(),
    }
  },

};