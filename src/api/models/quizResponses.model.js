/**
 *
 * QuizResponses
 *
 */

const mongoose = require("mongoose");
const _omitBy = require("lodash/omitBy");
const { isNullorUndefined } = require("../utils/helpers");

const allFields = "quizId attendedBy response userScore totalScore";

const quizResponsesSchema = new mongoose.Schema(
  {
    quizId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
    },
    attendedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    response: [Object],
    userScore: {
      type: Number,
    },
    totalScore: {
      type: Number,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// quizResponsesSchema.method({});

quizResponsesSchema.statics = {
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
      .populate("attendedBy", "id name")
      .populate({
        path: "quizId",
        select: "title",
        populate: {
          path: "questions",
        },
      })
      .exec();
  },

  async fetch(_id) {
    const quizResponses = await this.findOne({ _id })
      .populate({
        path: "quizId",
        populate: {
          path: "questions",
        },
      })
      .populate("attendedBy", "id name")
      .exec();
    return quizResponses;
  },

  async updatequizResponses(id, updates) {
    updates = _omitBy(updates, (each) => isNullorUndefined(each));
    await this.updateOne({ _id: id }, updates).exec();
  },
};

module.exports = mongoose.model("QuizResponses", quizResponsesSchema);
