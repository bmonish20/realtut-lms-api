const jwt = require('jsonwebtoken');
const moment = require('moment-timezone');
const crypto = require('crypto');
const { zoom: zoomConfig } = require('../../../config/vars');

exports.getApiAuthToken = () => {
  const {
    apiKey,
    apiSecret,
    tokenExpiryInSeconds
  } = zoomConfig;

  const payload = {
    iss: apiKey,
    exp: moment().add(tokenExpiryInSeconds, 'seconds').valueOf()
  }
  const token = jwt.sign(payload, apiSecret);

  return token;
}

exports.getJoiningToken = (meetingId, role) => {
  const {
    apiKey,
    apiSecret,
  } = zoomConfig;

  const timestamp = new Date().getTime() - 30000;
  const msg = Buffer.from(apiKey + meetingId + timestamp + role).toString('base64');
  const hash = crypto.createHmac('sha256', apiSecret).update(msg).digest('base64');
  const signature = Buffer.from(`${apiKey}.${meetingId}.${timestamp}.${role}.${hash}`).toString('base64');
  return signature;
}