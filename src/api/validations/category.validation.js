/**
*
* Category
*
*/

const Joi = require('joi');

module.exports = {
  // POST v1/category
  createCategory: {
    body: {
      // add collection fields here
    }
  },

  // GET /v1/category
  listCategory: {
    query: {
      page: Joi.number().min(1),
      perPage: Joi.number().min(1).max(100),
      date: Joi.alternatives([Joi.date(), Joi.string().valid('null')]),
      fields: Joi.string(),
    }
  },

  // GET /v1/category/:categoryId
  fetchCategory: {
    params: {
      categoryId: Joi.string().required()
    }
  },

  // PATCH /v1/category/:categoryId
  updateCategory: {
    params: {
      categoryId: Joi.string().required()
    },
    body: {
      // add collection fields here
    }
  },

  // DELETE /v1/category/:category
  deleteCategory: {
    params: {
      categoryId: Joi.string().required()
    }
  }
};