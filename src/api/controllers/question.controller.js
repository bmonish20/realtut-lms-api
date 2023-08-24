const httpStatus = require("http-status");
const Question = require("../models/question.model");

exports.list = async (req, res, next) => {
  try {
    const questions = await Question.list({
      ...req.query,
      createdBy: req.user._id,
    });
    res.json(questions);
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const question = new Question({
      ...req.body,
      createdBy: req.user._id,
    });
    const savedquestion = await question.save();
    res.status(httpStatus.CREATED);
    res.json(savedquestion);
  } catch (error) {
    next(error);
  }
};

exports.fetch = async (req, res, next) => {
  try {
    const { questionId } = req.params;
    const question = await Question.fetch(questionId);
    res.json(question);
  } catch (error) {
    next(error);
  }
};

exports.updateOne = async (req, res, next) => {
  try {
    const { questionId } = req.params;
    await Question.updateQuestion(questionId, req.body);
    res.status(httpStatus.NO_CONTENT);
    res.send();
  } catch (error) {
    next(error);
  }
};

exports.removeOne = async (req, res, next) => {
  try {
    const { questionId: _id } = req.params;
    await Question.deleteOne({ _id });
    res.status(httpStatus.NO_CONTENT);
    res.send();
  } catch (error) {
    next(error);
  }
};
