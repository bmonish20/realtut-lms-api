/**
 *
 * QuizResponses
 *
 */

const Joi = require("joi");

module.exports = {
  // POST v1/quizResponses
  createQuizResponses: {
    body: {
      quizId: Joi.string(),
      attendedBy: Joi.string(),
      response: Joi.array().items(Joi.object()),
    },
  },

  // GET /v1/quizResponses
  listQuizResponses: {
    query: {
      page: Joi.number().min(1),
      perPage: Joi.number().min(1).max(100),
      date: Joi.alternatives([Joi.date(), Joi.string().valid("null")]),
      fields: Joi.string(),
    },
  },

  // GET /v1/quizResponses/:quizResponsesId
  fetchQuizResponses: {
    params: {
      quizResponsesId: Joi.string().required(),
    },
  },

  // PATCH /v1/quizResponses/:quizResponsesId
  updateQuizResponses: {
    params: {
      quizResponsesId: Joi.string().required(),
    },
    body: {
      quizId: Joi.string(),
      attendedBy: Joi.string(),
      response: Joi.array().items(Joi.object()),
    },
  },

  // DELETE /v1/quizResponses/:quizResponses
  deleteQuizResponses: {
    params: {
      quizResponsesId: Joi.string().required(),
    },
  },
};
