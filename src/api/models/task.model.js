const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const _omitBy = require("lodash/omitBy");
const { isNullorUndefined } = require("../utils/helpers");

const allFields =
  "id taskName category subCategory client priority startDate dueDate time status description assignedTo logs fileUrl";

const taskSchema = new mongoose.Schema(
  {
    taskName: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      ref: "Category",
    },
    subCategory: {
      type: String,
      ref: "SubCategory",
    },
    client: {
      type: String,
      ref: "Client",
    },
    priority: {
      type: String,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    assignedTo: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    startDate: {
      type: Date,
    },
    dueDate: {
      type: Date,
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
    logs: [
      {
        type: Object,
      },
    ],
    fileUrl: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// taskSchema.method({

// });

taskSchema.statics = {
  async list({ page = 1, perPage = 30, date, fields = allFields, ...rest }) {
    const options = _omitBy(rest, (each) => isNullorUndefined(each));

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
    const task = await this.findOne({ _id })
      .populate("assignedTo", "name")
      .exec();
    return task;
  },

  async updateTask(id, updates) {
    updates = _omitBy(updates, (each) => isNullorUndefined(each));
    await this.updateOne({ _id: id }, updates).exec();
  },
};

taskSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Task", taskSchema);
