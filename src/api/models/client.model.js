/**
 *
 * Client
 *
 */

const mongoose = require("mongoose");
const _omitBy = require("lodash/omitBy");
const { isNullorUndefined } = require("../utils/helpers");

const allFields = "_id";

const clientSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
    },
  },
  {}
);

clientSchema.method({});

clientSchema.statics = {
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

  async saveClient(client) {
    await this.updateOne(
      { _id: client },
      { $set: { _id: client } },
      { upsert: true }
    ).exec();
  },

  async fetch(_id) {
    const client = await this.findOne({ _id }).exec();
    return client;
  },

  async updateClient(id, updates) {
    updates = _omitBy(updates, (each) => isNullorUndefined(each));
    await this.updateOne({ _id: id }, updates).exec();
  },
};

module.exports = mongoose.model("Client", clientSchema);
