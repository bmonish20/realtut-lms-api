/**
*
* EventRegistrations
*
*/

const Joi = require('joi');

module.exports = {
  // POST /v1/event/:eventId/register
  register: {
    params: {
      eventId: Joi.string().required()
    }
  },
  
  // DELETE /v1/event/:eventId/register
  removeRegistration: {
    params: {
      eventId: Joi.string().required()
    }
  }
};