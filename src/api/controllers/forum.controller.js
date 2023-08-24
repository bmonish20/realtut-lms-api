/**
*
* Forum
*
*/

const httpStatus = require('http-status');
const Forum = require('../models/forum.model');

exports.list = async (req, res, next) => {
  try {
    const forums = await Forum.list(req.query);
    res.json(forums);
  }
  catch (error) {
    next(error);
  }
}

exports.create = async (req, res, next) => {
  try {
    const forum = new Forum({
      ...req.body,
    });
    const savedforum = await forum.save();
    res.status(httpStatus.CREATED);
    res.json(savedforum);
  } catch (error) {
    next(error);
  }
}

exports.fetch = async (req, res, next) => {
  try {
    const { forumId } = req.params;
    const forum = await Forum.fetch(forumId);
    res.json(forum);
  }
  catch (error) {
    next(error);
  }
}

exports.updateOne = async (req, res, next) => {
  try {
    const { forumId } = req.params;
    await Forum.updateForum(forumId, req.body);
    res.status(httpStatus.NO_CONTENT);
    res.send();
  }
  catch(error) {
    next(error);
  }
}

exports.removeOne = async (req, res, next) => {
  try {
    const { forumId: _id } = req.params;
    await Forum.deleteOne({ _id });
    res.status(httpStatus.NO_CONTENT);
    res.send();
  }
  catch(error) {
    next(error);
  }
}
