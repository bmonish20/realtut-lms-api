/**
 *
 * InviteUser
 *
 */

const Joi = require("joi");

module.exports = {
  // POST v1/inviteUser
  createInviteUser: {
    body: {
      name: Joi.string().required(),
      email: Joi.string().required(),
    },
  },

  // GET /v1/inviteUser
  listInviteUser: {
    query: {
      page: Joi.number().min(1),
      perPage: Joi.number().min(1).max(100),
      date: Joi.alternatives([Joi.date(), Joi.string().valid("null")]),
      fields: Joi.string(),
    },
  },

  // GET /v1/inviteUser/:inviteUserId
  fetchInviteUser: {
    params: {
      inviteUserId: Joi.string().required(),
    },
  },

  // PATCH /v1/inviteUser/:inviteUserId
  updateInviteUser: {
    params: {
      inviteUserId: Joi.string().required(),
    },
    body: {
      // add collection fields here
    },
  },

  // DELETE /v1/inviteUser/:inviteUser
  deleteInviteUser: {
    params: {
      inviteUserId: Joi.string().required(),
    },
  },
};
