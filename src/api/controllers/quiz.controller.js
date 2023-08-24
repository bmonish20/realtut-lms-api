const httpStatus = require("http-status");
const Quiz = require("../models/quiz.model");
const { createActivity } = require("../utils/activityAndNotificationHelpers");

exports.list = async (req, res, next) => {
  try {
    const quizs = await Quiz.list(req.query);
    res.json(quizs);
  } catch (error) {
    next(error);
  }
};

exports.my = async (req, res, next) => {
  try {
    const quizzes = await Quiz.list({ ...req.query, createdBy: req.user._id });
    res.json(quizzes);
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const quiz = new Quiz({
      ...req.body,
      createdBy: req.user._id,
    });
    const savedquiz = await quiz.save();
    createActivity(req.user._id, "quiz", `Created ${savedquiz.title}`);
    res.status(httpStatus.CREATED);
    res.json(savedquiz);
  } catch (error) {
    next(error);
  }
};

exports.fetch = async (req, res, next) => {
  try {
    const { quizId } = req.params;
    const quiz = await Quiz.fetch(quizId);
    res.json(quiz);
  } catch (error) {
    next(error);
  }
};

exports.updateOne = async (req, res, next) => {
  try {
    const { quizId } = req.params;
    await Quiz.updateQuiz(quizId, req.body);
    createActivity(req.user._id, "quiz", `Updated ${req.body.title}`);
    res.status(httpStatus.NO_CONTENT);
    res.send();
  } catch (error) {
    next(error);
  }
};

exports.removeOne = async (req, res, next) => {
  try {
    const { quizId: _id } = req.params;
    const quiz = await Quiz.fetch(_id);
    await Quiz.deleteOne({ _id });
    createActivity(req.user._id, "quiz", `Deleted ${quiz.title}`);
    res.status(httpStatus.NO_CONTENT);
    res.send();
  } catch (error) {
    next(error);
  }
};
