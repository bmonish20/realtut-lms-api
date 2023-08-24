/**
 *
 * Todo
 *
 */

const httpStatus = require("http-status");
const Todo = require("../models/todo.model");

exports.list = async (req, res, next) => {
  try {
    const todos = await Todo.list(req.query, req.user._id);
    res.json(todos);
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const todo = new Todo({
      ...req.body,
      createdBy: req.user._id,
    });
    const savedTodo = await todo.save();
    res.status(httpStatus.CREATED);
    res.json(savedTodo);
  } catch (error) {
    next(error);
  }
};

exports.fetch = async (req, res, next) => {
  try {
    const { todoId } = req.params;
    const todo = await Todo.fetch(todoId);
    res.json(todo);
  } catch (error) {
    next(error);
  }
};

exports.updateOne = async (req, res, next) => {
  try {
    const { todoId } = req.params;
    await Todo.updateTodo(todoId, req.body);
    res.status(httpStatus.NO_CONTENT);
    res.send();
  } catch (error) {
    next(error);
  }
};

exports.removeOne = async (req, res, next) => {
  try {
    const { todoId: _id } = req.params;
    await Todo.deleteOne({ _id });
    res.status(httpStatus.NO_CONTENT);
    res.send();
  } catch (error) {
    next(error);
  }
};
