const httpStatus = require("http-status");
const QuizResponses = require("../models/quizResponses.model");
const Quiz = require("../models/quiz.model");
const {
  createActivity,
  sendNotification,
} = require("../utils/activityAndNotificationHelpers");

exports.list = async (req, res, next) => {
  try {
    const quizResponsess = await QuizResponses.list({
      ...req.query,
    });
    res.json(quizResponsess);
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const quizResponses = new QuizResponses({
      ...req.body,
      attendedBy: req.user._id,
    });
    const savedquizResponses = await quizResponses.save();
    const quiz = await Quiz.findById(req.body.quizId);
    createActivity(req.user._id, "quiz", `Attended ${quiz.title}`);
    res.status(httpStatus.CREATED);
    res.json(savedquizResponses);
  } catch (error) {
    next(error);
  }
};

exports.fetch = async (req, res, next) => {
  try {
    const { quizResponsesId } = req.params;
    const quizResponses = await QuizResponses.fetch(quizResponsesId);
    res.json(quizResponses);
  } catch (error) {
    next(error);
  }
};

exports.updateOne = async (req, res, next) => {
  try {
    const { quizResponsesId } = req.params;
    await QuizResponses.updatequizResponses(quizResponsesId, req.body);
    const quiz = await Quiz.findById(req.body.quizId);
    createActivity(req.user._id, "quiz", `Reviewed ${quiz.title}`);
    sendNotification(
      req.body.attendedBy,
      "Quiz Response",
      `Your submission for ${quiz.title} got reviewed`
    );
    res.status(httpStatus.NO_CONTENT);
    res.send();
  } catch (error) {
    next(error);
  }
};

exports.removeOne = async (req, res, next) => {
  try {
    const { quizResponsesId: _id } = req.params;
    const quiz = await Quiz.findById(req.body.quizId);
    await QuizResponses.deleteOne({ _id });
    createActivity(req.user._id, "quiz", `Deleted a Response of ${quiz.title}`);
    res.status(httpStatus.NO_CONTENT);
    res.send();
  } catch (error) {
    next(error);
  }
};
