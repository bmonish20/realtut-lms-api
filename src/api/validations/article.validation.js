/**
*
* Article
*
*/

const Joi = require('joi');

module.exports = {
  // POST v1/article
  createArticle: {
    body: {
      title: Joi.string().required(),
      isDraft: Joi.boolean().required(),
      category: Joi.string().required(),
      description: Joi.string().required()
    }
  },

  // GET /v1/article
  listArticle: {
    query: {
      page: Joi.number().min(1),
      perPage: Joi.number().min(1).max(100),
      date: Joi.alternatives([Joi.date(), Joi.string().valid('null')]),
      fields: Joi.string(),
      isDraft: Joi.boolean(),
      writtenBy: Joi.string(),
    }
  },

  // GET /v1/article/:articleId
  fetchArticle: {
    params: {
      articleId: Joi.string().required()
    }
  },

  // PATCH /v1/article/:articleId
  updateArticle: {
    params: {
      articleId: Joi.string().required()
    },
    body: {
      title: Joi.string(),
      isDraft: Joi.boolean(),
      category: Joi.string(),
      description: Joi.string()
    }
  },

  // DELETE /v1/article/:articleId
  deleteArticle: {
    params: {
      articleId: Joi.string().required()
    }
  },

  // POST /v1/article/:articleId/like
  likeArticle: {
    params: {
      articleId: Joi.string().required()
    }
  },

  // DELETE /v1/article/:articleId/like
  unlikeArticle: {
    params: {
      articleId: Joi.string().required()
    }
  },
};