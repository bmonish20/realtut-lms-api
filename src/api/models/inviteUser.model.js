/**
 *
 * InviteUser
 *
 */

const mongoose = require("mongoose");
const _omitBy = require("lodash/omitBy");
const { isNullorUndefined } = require("../utils/helpers");

const allFields = "name email inviteSentBy";

const inviteUserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      maxlength: 128,
      index: true,
      trim: true,
    },
    email: {
      type: String,
      match: /^\S+@\S+\.\S+$/,
      required: true,
      trim: true,
      lowercase: true,
    },
    inviteSentBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

inviteUserSchema.method({});

inviteUserSchema.statics = {
  async list({ page = 1, perPage = 30, date, fields = allFields }) {
    const options = {};

    if (date && date != "null") {
      options["dateTime"] = { $gte: date };
    }
    if (fields && fields != "null") {
      fields = fields.replace(/,/g, " ");
    }

    return this.find(options, fields)
      .sort({ createdAt: 1 })
      .skip(perPage * (page - 1))
      .limit(perPage)
      .exec();
  },

  async fetch(_id) {
    const inviteUser = await this.findOne({ _id }).exec();
    return inviteUser;
  },

  async updateInviteUser(id, updates) {
    updates = _omitBy(updates, (each) => isNullorUndefined(each));
    await this.updateOne({ _id: id }, updates).exec();
  },
};

module.exports = mongoose.model("InviteUser", inviteUserSchema);
