const httpStatus = require('http-status');
const ZoomService = require('../services/zoom');

exports.token = async (req, res, next) => {
  try {
    const { meetingId, role } = req.query;
    const data = await ZoomService.fetchToken(meetingId, role);
    res.json(data);
  }
  catch (error) {
    next(error);
  }
}