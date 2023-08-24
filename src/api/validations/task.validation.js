const Joi = require("joi");

module.exports = {
  // POST v1/task
  createTask: {
    body: {
      taskName: Joi.string().required(),
      priority: Joi.string().required(),
      status: Joi.string().required(),
    },
  },

  // GET /v1/task
  listTask: {
    query: {
      page: Joi.number().min(1),
      perPage: Joi.number().min(1).max(100),
      date: Joi.alternatives([Joi.date(), Joi.string().valid("null")]),
      fields: Joi.string(),
    },
  },

  // GET /v1/task/:taskId
  fetchTask: {
    params: {
      taskId: Joi.string().required(),
    },
  },

  // PATCH /v1/task/:taskId
  updateTask: {
    params: {
      taskId: Joi.string().required(),
    },
    body: {
      taskName: Joi.string(),
      priority: Joi.string(),
      status: Joi.string(),
    },
  },

  // DELETE /v1/task/:task
  deleteTask: {
    params: {
      taskId: Joi.string().required(),
    },
  },
};
