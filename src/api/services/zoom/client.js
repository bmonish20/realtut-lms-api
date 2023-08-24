const axios = require('axios');
const { zoom: { baseURL }} = require('../../../config/vars');
const { getApiAuthToken } = require('./auth');
const APIError = require('../../utils/APIError');
const logger = require('../../../config/logger');

exports.call = async (config = {}) => {
  try {
    const { data } = await axios.request({
      baseURL,
      headers: {
        Authorization: `Bearer ${getApiAuthToken()}`
      },
      ...config
    });
    return data;
  }
  catch(err) {
    logger.error(JSON.stringify({
        error: err.message,
        url: `${baseURL}${config.url}`,
        method: config.method,
        data: err.response ? err.response.data : err.response
    }));
    throw new APIError(err);
  }
}