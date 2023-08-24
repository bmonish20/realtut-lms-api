/**
 *
 * Todo
 *
 */

const Joi = require("joi");

module.exports = {
  // POST v1/todo
  createTodo: {
    body: {
      todoName: Joi.string().required(),
      priority: Joi.string().required(),
      dueDate: Joi.date().required(),
      time: Joi.string(),
      status: Joi.string().required(),
    },
  },

  // GET /v1/todo
  listTodo: {
    query: {
      page: Joi.number().min(1),
      perPage: Joi.number().min(1).max(100),
      date: Joi.alternatives([Joi.date(), Joi.string().valid("null")]),
      fields: Joi.string(),
    },
  },

  // GET /v1/todo/:todoId
  fetchTodo: {
    params: {
      todoId: Joi.string().required(),
    },
  },

  // PATCH /v1/todo/:todoId
  updateTodo: {
    params: {
      todoId: Joi.string().required(),
    },
    body: {
      todoName: Joi.string(),
      priority: Joi.string(),
      dueDate: Joi.date(),
      time: Joi.string(),
      status: Joi.string(),
    },
  },

  // DELETE /v1/todo/:todo
  deleteTodo: {
    params: {
      todoId: Joi.string().required(),
    },
  },
};
