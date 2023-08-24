const _get = require('lodash/get');
const ZoomService = require('../services/zoom');

exports.populateZoomMeetingDetail = async (meetingId, target, path) => {
  try {
    const meetingDetails = await ZoomService.fetchMeeting(meetingId);
    target[path] = meetingDetails;
  }
  catch(err) {
    target[path] = null;
  }
}

exports.populateZoomMeetingDetails = async (
  srcObj = [],
  meetingIdPath,
  targetPath
) => {
  for(var i = 0; i < srcObj.length; i++) {
    const id = _get(srcObj[i], meetingIdPath, null);
    if(id) {
      await this.populateZoomMeetingDetail(id, srcObj[i], targetPath)
    }
  }
}