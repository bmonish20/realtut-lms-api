/**
 *
 * Poll
 *
 */

const httpStatus = require("http-status");
const Poll = require("../models/poll.model");

exports.list = async (req, res, next) => {
  try {
    const polls = await Poll.list(req.query);
    res.json(polls);
  } catch (error) {
    next(error);
  }
};

exports.my = async (req, res, next) => {
  try {
    const polls = await Poll.list({
      ...req.query,
      createdBy: req.user._id,
    });
    res.json(polls);
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const poll = new Poll({
      ...req.body,
      createdBy: req.user._id,
    });
    const savedpoll = await poll.save();
    res.status(httpStatus.CREATED);
    res.json(savedpoll);
  } catch (error) {
    next(error);
  }
};

exports.fetch = async (req, res, next) => {
  try {
    const { pollId } = req.params;
    const poll = await Poll.fetch(pollId);
    res.json(poll);
  } catch (error) {
    next(error);
  }
};

exports.updateOne = async (req, res, next) => {
  try {
    const { pollId } = req.params;
    await Poll.updatePoll(pollId, req.body);
    res.status(httpStatus.NO_CONTENT);
    res.send();
  } catch (error) {
    next(error);
  }
};

exports.removeOne = async (req, res, next) => {
  try {
    const { pollId: _id } = req.params;
    await Poll.deleteOne({ _id });
    res.status(httpStatus.NO_CONTENT);
    res.send();
  } catch (error) {
    next(error);
  }
};
