/**
 *
 * Category
 *
 */

const mongoose = require("mongoose");
const _omitBy = require("lodash/omitBy");
const { isNullorUndefined } = require("../utils/helpers");

const allFields = "_id";

const categorySchema = new mongoose.Schema(
  {
    _id: {
      type: String,
    },
  },
  {}
);

categorySchema.method({});

categorySchema.statics = {
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

  async saveCategory(category) {
    await this.updateOne(
      { _id: category },
      { $set: { _id: category } },
      { upsert: true }
    ).exec();
  },

  async fetch(_id) {
    const category = await this.findOne({ _id }).exec();
    return category;
  },

  async updateCategory(id, updates) {
    updates = _omitBy(updates, (each) => isNullorUndefined(each));
    await this.updateOne({ _id: id }, updates).exec();
  },
};

module.exports = mongoose.model("Category", categorySchema);
