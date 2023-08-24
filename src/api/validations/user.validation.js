const Joi = require("joi");
const User = require("../models/user.model");

module.exports = {
  // GET /v1/users
  listUsers: {
    query: {
      page: Joi.number().min(1),
      perPage: Joi.number().min(1).max(100),
      name: Joi.string(),
      email: Joi.string(),
      role: Joi.string(),
      searchPattern: Joi.string(),
    },
  },

  // POST /v1/users
  createUser: {
    body: {
      email: Joi.string().email().required(),
      password: Joi.string().min(6).max(128).required(),
      name: Joi.string().max(128),
      role: Joi.string().valid(User.roles),
    },
  },

  // PUT /v1/users/:userId
  replaceUser: {
    body: {
      email: Joi.string().email().required(),
      password: Joi.string().min(6).max(128).required(),
      name: Joi.string().max(128),
      role: Joi.string().valid(User.roles),
    },
    params: {
      userId: Joi.string()
        .regex(/^[a-fA-F0-9]{24}$/)
        .required(),
    },
  },

  // PATCH /v1/users/:userId
  updateUser: {
    body: {
      email: Joi.string().email(),
      firstName: Joi.string().max(128),
      lastName: Joi.string().max(128),
      phoneNumber: Joi.string().length(10),
      userName: Joi.string().max(128),
      currentRole: Joi.string().max(128),
      companyName: Joi.string().max(128),
      yearsOfExpeirence: Joi.number().max(100),
      bio: Joi.string().allow("").allow(null),
      companyInfo: Joi.any().allow(null),
      collegeInfo: Joi.any().allow(null),
    },
    params: {
      userId: Joi.string()
        .regex(/^[a-fA-F0-9]{24}$/)
        .required(),
    },
  },
};
