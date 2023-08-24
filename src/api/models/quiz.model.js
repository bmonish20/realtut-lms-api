const mongoose = require("mongoose");
const _omitBy = require("lodash/omitBy");
const { isNullorUndefined } = require("../utils/helpers");

const allFields = "id title forCourse duration questions";

const quizSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    forCourse: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
    },
    questions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question",
      },
    ],
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

// quizSchema.method({

// });

quizSchema.statics = {
  async list({ page = 1, perPage = 30, date, fields = allFields, ...rest }) {
    const options = _omitBy(rest, (each) => isNullorUndefined(each));

    if (date && date != "null") {
      options["dateTime"] = { $gte: date };
    }
    if (fields && fields != "null") {
      fields = fields.replace(/,/g, " ");
    }

    return this.find(options, fields)
      .populate('createdBy', 'name picture')
      .sort({ createdAt: 1 })
      .skip(perPage * (page - 1))
      .limit(perPage)
      .exec();
  },

  async fetch(_id) {
    const quiz = await this.findOne({ _id }).populate("questions").exec();
    return quiz;
  },

  async updateQuiz(id, updates) {
    updates = _omitBy(updates, (each) => isNullorUndefined(each));
    await this.updateOne({ _id: id }, updates).exec();
  },
};

module.exports = mongoose.model("Quiz", quizSchema);
