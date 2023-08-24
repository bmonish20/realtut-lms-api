const mongoose = require("mongoose");
const _omitBy = require("lodash/omitBy");
const { isNullorUndefined } = require("../utils/helpers");

const allFields = "id question type points mcqOptions createdBy";

const questionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    mcqOptions: {
      type: [String],
    },
    points: {
      type: String,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// questionSchema.method({});

questionSchema.statics = {
  async list({ page = 1, perPage = 30, date, fields = allFields, ...rest }) {
    const options = _omitBy(rest, (each) => isNullorUndefined(each));

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
    const question = await this.findOne({ _id }).exec();
    return question;
  },

  async updateQuestion(id, updates) {
    updates = _omitBy(updates, (each) => isNullorUndefined(each));
    await this.updateOne({ _id: id }, updates).exec();
  },
};

module.exports = mongoose.model("Question", questionSchema);
