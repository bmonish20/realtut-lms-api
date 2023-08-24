/**
*
* Forum
*
*/

const Joi = require('joi');

module.exports = {
  // POST v1/forum
  createForum: {
    body: {
      userId: Joi.string().required(),
      message: Joi.string().required(),
      dateTime: Joi.number().required(),
    }
  },

  // GET /v1/forum
  listForum: {
    query: {
      page: Joi.number().min(1),
      perPage: Joi.number().min(1).max(100),
      date: Joi.alternatives([Joi.date(), Joi.string().valid('null')]),
      fields: Joi.string(),
    }
  },

  // GET /v1/forum/:forumId
  fetchForum: {
    params: {
      forumId: Joi.string().required()
    }
  },

  // PATCH /v1/forum/:forumId
  updateForum: {
    params: {
      forumId: Joi.string().required()
    },
    body: {
      // add collection fields here
    }
  },

  // DELETE /v1/forum/:forum
  deleteForum: {
    params: {
      forumId: Joi.string().required()
    }
  }
};