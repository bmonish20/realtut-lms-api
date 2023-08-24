const Joi = require("joi");

module.exports = {
  // POST v1/question
  createQuestion: {
    body: {
      question: Joi.string().required(),
      type: Joi.string().required(),
      points: Joi.string().required(),
    },
  },

  // GET /v1/question
  listQuestion: {
    query: {
      page: Joi.number().min(1),
      perPage: Joi.number().min(1).max(100),
      date: Joi.alternatives([Joi.date(), Joi.string().valid("null")]),
      fields: Joi.string(),
    },
  },

  // GET /v1/question/:questionId
  fetchQuestion: {
    params: {
      questionId: Joi.string().required(),
    },
  },

  // PATCH /v1/question/:questionId
  updateQuestion: {
    params: {
      questionId: Joi.string().required(),
    },
    body: {
      question: Joi.string().required(),
      type: Joi.string().required(),
      points: Joi.string().required(),
    },
  },

  // DELETE /v1/question/:question
  deleteQuestion: {
    params: {
      questionId: Joi.string().required(),
    },
  },
};
