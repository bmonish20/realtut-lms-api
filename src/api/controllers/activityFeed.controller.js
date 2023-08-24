/**
*
* ActivityFeed
*
*/

const httpStatus = require('http-status');
const ActivityFeed = require('../models/activityFeed.model');

exports.list = async (req, res, next) => {
  try {
    const activityFeeds = await ActivityFeed.list(req.query, req.user._id);
    res.json(activityFeeds);
  }
  catch (error) {
    next(error);
  }
}

exports.create = async (req, res, next) => {
  try {
    const activityFeed = new ActivityFeed({
      ...req.body,
    });
    const savedactivityFeed = await activityFeed.save();
    res.status(httpStatus.CREATED);
    res.json(savedactivityFeed);
  } catch (error) {
    next(error);
  }
}

