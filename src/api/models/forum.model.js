/**
*
* Forum
*
*/

const mongoose = require('mongoose');
const  _omitBy = require('lodash/omitBy');
const { isNullorUndefined } = require('../utils/helpers');

const allFields = 'eventId courseId userId message dateTime';

const forumSchema = new mongoose.Schema({
  eventId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
  },
  userId:{
    type:mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  courseId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
  },
  message:{
    type: String,
    required: true,
  },
  dateTime:{
    type: Number,
    required: true,
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

forumSchema.method({

});

forumSchema.statics = {
  async list({
    page = 1, perPage = 30, date, fields = allFields, courseId, ...rest
  }) {
    const options = _omitBy(rest, (each) => isNullorUndefined(each));

    if(courseId && courseId != 'null') {
      options['courseId'] = { $eq: courseId }
    }
     
    if(date && date != 'null') {
      options['dateTime'] = { $gte: date }
    }
     
    if(fields && fields != 'null') {
      fields = fields.replace(/,/g, ' ');
    }

    return this.find(options, fields)
      .populate("userId", "name")
      .sort({ dateTime: -1 })
      .skip(perPage * (page - 1))
      .limit(perPage)
      .exec();
  },
  
  async fetch(_id) {
    const forum = await this.findOne({ _id })
      .exec();
    return forum;
  },

  async updateforum(id, updates) {
    updates = _omitBy(updates, (each) => isNullorUndefined(each));
    await this.updateOne({ _id: id }, updates).exec();
  }
}

module.exports = mongoose.model('Forum', forumSchema);
