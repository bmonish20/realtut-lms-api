/**
*
* Chapter
*
*/

const httpStatus = require('http-status');
const Chapter = require('../models/chapter.model');
const ZoomService = require('../services/zoom');

exports.list = async (req, res, next) => {
  try {
    const chapters = await Chapter.list(req.query);
    res.json(chapters);
  }
  catch (error) {
    next(error);
  }
}

exports.my = async (req, res, next) => {
  try {
    const chapters = await Chapter.list({
      ...req.query,
      createdBy: req.user._id
    });
    res.json(chapters);
  }
  catch (error) {
    next(error);
  }
}

exports.create = async (req, res, next) => {
  try {
    // const meeting = await ZoomService.createMeeting({
    //   ...req.body
    // });
    const chapter = new Chapter({
      ...req.body,
      createdBy: req.user._id,
      link: "123"
    });
    const savedChapter = await chapter.save();
    res.status(httpStatus.CREATED);
    res.json(savedChapter);
  } catch (error) {
    next(error);
  }
}

exports.fetch = async (req, res, next) => {
  try {
    const { chapterId } = req.params;
    const chapter = await Chapter.fetch(chapterId);
    res.json(chapter);
  }
  catch (error) {
    next(error);
  }
}

exports.updateOne = async (req, res, next) => {
  try {
    const { chapterId } = req.params;
    // await ZoomService.updateMeeting(req.body.link, req.body);
    await Chapter.updateChapter(chapterId, req.body);
    res.status(httpStatus.NO_CONTENT);
    res.send();
  }
  catch(error) {
    next(error);
  }
}

exports.removeOne = async (req, res, next) => {
  try {
    const { chapterId: _id } = req.params;
    // const chapter = await Chapter.fetch(_id);
    // await ZoomService.deleteMeeting(chapter.link);
    await Chapter.deleteOne({ _id });
    res.status(httpStatus.NO_CONTENT);
    res.send();
  }
  catch(error) {
    next(error);
  }
}
