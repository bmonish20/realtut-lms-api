const mongoose = require("mongoose");
const _omitBy = require("lodash/omitBy");
const { isNullorUndefined } = require("../utils/helpers");

const allFields = "id todoName priority dueDate time status description";

const todoSchema = new mongoose.Schema(
  {
    todoName: {
      type: String,
      required: true,
    },
    priority: {
      type: String,
      required: true,
    },
    createdBy: {
      type: String,
      required: true,
      ref: "User",
    },
    dueDate: {
      type: Date,
      required: true,
    },
    time: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

todoSchema.method({});

todoSchema.statics = {
  async list({ page = 1, perPage = 30, date, fields = allFields }, userId) {
    const options = {};

    if (userId && userId != "null") {
      options["createdBy"] = userId;
    }

    if (date && date != "null") {
      options["dateTime"] = { $gte: date };
    }
    if (fields && fields != "null") {
      fields = fields.replace(/,/g, " ");
    }

    return this.find(options, fields)
      .sort({ createdAt: -1 })
      .skip(perPage * (page - 1))
      .limit(perPage)
      .exec();
  },

  async fetch(_id) {
    const todo = await this.findOne({ _id }).exec();
    return todo;
  },

  async updateTodo(id, updates) {
    updates = _omitBy(updates, (each) => isNullorUndefined(each));
    await this.updateOne({ _id: id }, updates).exec();
  },
};

module.exports = mongoose.model("Todo", todoSchema);
