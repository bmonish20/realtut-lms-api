const { join } = require("bluebird");
const Joi = require("joi");

module.exports = {
  // POST v1/quiz
  createQuiz: {
    body: {
      title: Joi.string().required(),
      forCourse: Joi.string().required(),
      duration: Joi.number(),
      questions: Joi.array().items(Joi.string()),
    },
  },

  // GET /v1/quiz
  listQuiz: {
    query: {
      page: Joi.number().min(1),
      perPage: Joi.number().min(1).max(100),
      date: Joi.alternatives([Joi.date(), Joi.string().valid("null")]),
      fields: Joi.string(),
    },
  },

  // GET /v1/quiz/:quizId
  fetchQuiz: {
    params: {
      quizId: Joi.string().required(),
    },
  },

  // PATCH /v1/quiz/:quizId
  updateQuiz: {
    params: {
      quizId: Joi.string().required(),
    },
    body: {
      title: Joi.string().required(),
      forCourse: Joi.string().required(),
      duration: Joi.number(),
      questions: Joi.array().items(Joi.string()),
    },
  },

  // DELETE /v1/quiz/:quiz
  deleteQuiz: {
    params: {
      quizId: Joi.string().required(),
    },
  },
};
