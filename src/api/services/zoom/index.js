const zoomClient = require('./client');
const { zoom: zoomConfig } = require('../../../config/vars');
const CreateMeeting = require('./models/createMeeting');
const APIError = require('../../utils/APIError');
const { getJoiningToken } = require('./auth');

exports.createMeeting = async (meetingDetails) => {
  try {
    const { userId } = zoomConfig;
    const payload = new CreateMeeting({
      ...meetingDetails
    });
    const meeting = await zoomClient.call({
      url: `/users/${userId}/meetings`,
      method: 'POST',
      data: payload
    });
    return meeting;
  }
  catch(err) {
    throw new APIError(err);
  }
}

exports.fetchMeeting = async meetingId => {
  try {
    const meeting = await zoomClient.call({
      url: `/meetings/${meetingId}`,
      method: 'GET'
    });
    return meeting;
  }
  catch(err) {
    throw new APIError(err);
  }
}

exports.fetchToken = async (meetingId, role) => {
  try {
    const signature = getJoiningToken(meetingId, role);
    const {
      password
    } = await zoomClient.call({
      url: `/meetings/${meetingId}`,
      method: 'GET'
    });
    return {
      signature,
      password,
      meetingId,
      apiKey: zoomConfig.apiKey
    }
  }
  catch(err) {
    throw new APIError(err);
  }
}

exports.updateMeeting = async (meetingId, meetingDetails) => {
  try {
    const payload = new CreateMeeting({
      ...meetingDetails
    });
    const meeting = await zoomClient.call({
      url: `/meetings/${meetingId}`,
      method: 'PATCH',
      data: payload
    });
    return meeting;
  }
  catch(err) {
    throw new APIError(err);
  }
}

exports.deleteMeeting = async meetingId => {
  try {
    await zoomClient.call({
      url: `/meetings/${meetingId}`,
      method: 'DELETE'
    });
  }
  catch(err) {
    throw new APIError(err);
  }
}