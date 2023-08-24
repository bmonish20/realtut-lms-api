/**
*
* SubCategory
*
*/

const Joi = require('joi');

module.exports = {
  // POST v1/subCategory
  createSubCategory: {
    body: {
      // add collection fields here
    }
  },

  // GET /v1/subCategory
  listSubCategory: {
    query: {
      page: Joi.number().min(1),
      perPage: Joi.number().min(1).max(100),
      date: Joi.alternatives([Joi.date(), Joi.string().valid('null')]),
      fields: Joi.string(),
    }
  },

  // GET /v1/subCategory/:subCategoryId
  fetchSubCategory: {
    params: {
      subCategoryId: Joi.string().required()
    }
  },

  // PATCH /v1/subCategory/:subCategoryId
  updateSubCategory: {
    params: {
      subCategoryId: Joi.string().required()
    },
    body: {
      // add collection fields here
    }
  },

  // DELETE /v1/subCategory/:subCategory
  deleteSubCategory: {
    params: {
      subCategoryId: Joi.string().required()
    }
  }
};