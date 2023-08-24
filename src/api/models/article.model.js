/**
*
* Article
*
*/

const mongoose = require('mongoose');
const  _omitBy = require('lodash/omitBy');
const { isNullorUndefined } = require('../utils/helpers');

const allFields = 'id category description writtedBy readDurationInMins createdAt';

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  isDraft: {
    type: Boolean,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  writtenBy: {
    type: String,
    required: true,
    ref: 'User'
  },
  readDurationInMins: {
    type: Number
  },
  pictureUrl: {
    type: String
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

articleSchema.pre("save", function save(next) {
  const words = (this.description.length / 4.7);
  this.readDurationInMins = Math.ceil(words / 450);
  return next();
});

articleSchema.virtual('likes', {
  ref: 'ArticleInteraction',
  localField: '_id',
  foreignField: 'articleId',
  count: true
});

const isLikedVirtual = articleSchema.virtual('isLiked', {
  ref: 'ArticleInteraction',
  localField: '_id',
  foreignField: 'articleId',
  justOne: true
});

isLikedVirtual.getters.unshift(doc => !!doc);

articleSchema.method({

});

articleSchema.statics = {
  async list({
    page = 1, perPage = 30, date, fields = allFields, userId, ...rest
  }) {
    const options = { ..._omitBy(rest, (each) => isNullorUndefined(each)) };

    if(date && date != 'null') {
      options['dateTime'] = { $gte: date }
    }
    if(fields && fields != 'null') {
      fields = fields.replace(/,/g, ' ');
    }

    return this.find(options, fields)
      .populate('writtenBy', 'id name picture')
      .populate('likes')
      .populate({
        path: 'isLiked',
        match: { likedBy: userId }
      })
      .sort({ createdAt: 1 })
      .skip(perPage * (page - 1))
      .limit(perPage)
      .exec();
  },
  
  async fetch(_id, userId) {
    const article = await this.findOne({ _id })
      .populate('writtenBy', 'id name picture')
      .populate('likes')
      .populate({
        path: 'isLiked',
        match: { likedBy: userId }
      })
      .exec();
    return article;
  },

  async updateArticle(id, updates) {
    updates = _omitBy(updates, (each) => isNullorUndefined(each));
    await this.updateOne({ _id: id }, updates).exec();
  },

  async distinctCategories() {
    return this.find().distinct('category').exec();
  }
}

module.exports = mongoose.model('Article', articleSchema);
