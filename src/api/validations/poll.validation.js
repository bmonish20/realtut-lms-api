/**
 *
 * Poll
 *
 */

const Joi = require("joi");

module.exports = {
  // POST v1/poll
  createPoll: {
    body: {
      title: Joi.string().required(),
      options: Joi.array().items(Joi.object()),
      courseId: Joi.string().required(),
      createdBy: Joi.string(),
    },
  },

  // GET /v1/poll
  listPoll: {
    query: {
      page: Joi.number().min(1),
      perPage: Joi.number().min(1).max(100),
      date: Joi.alternatives([Joi.date(), Joi.string().valid("null")]),
      fields: Joi.string(),
    },
  },

  // GET /v1/poll/:pollId
  fetchPoll: {
    params: {
      pollId: Joi.string().required(),
    },
  },

  // PATCH /v1/poll/:pollId
  updatePoll: {
    params: {
      pollId: Joi.string().required(),
    },
    body: {
      // add collection fields here
    },
  },

  // DELETE /v1/poll/:poll
  deletePoll: {
    params: {
      pollId: Joi.string().required(),
    },
  },
};
