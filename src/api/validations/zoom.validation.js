const Joi = require('joi');

module.exports = {
  tokenValidation: {
    query: {
      meetingId: Joi.number().required(),
      role: Joi.number().allow(0,1)
    }
  }
}