/**
*
* Client
*
*/

const Joi = require('joi');

module.exports = {
  // POST v1/client
  createClient: {
    body: {
      // add collection fields here
    }
  },

  // GET /v1/client
  listClient: {
    query: {
      page: Joi.number().min(1),
      perPage: Joi.number().min(1).max(100),
      date: Joi.alternatives([Joi.date(), Joi.string().valid('null')]),
      fields: Joi.string(),
    }
  },

  // GET /v1/client/:clientId
  fetchClient: {
    params: {
      clientId: Joi.string().required()
    }
  },

  // PATCH /v1/client/:clientId
  updateClient: {
    params: {
      clientId: Joi.string().required()
    },
    body: {
      // add collection fields here
    }
  },

  // DELETE /v1/client/:client
  deleteClient: {
    params: {
      clientId: Joi.string().required()
    }
  }
};