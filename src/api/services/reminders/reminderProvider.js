const Event = require("../../models/event.model");
const Course = require("../../models/course.model");
const User = require("../../models/user.model");
const {
  sendNotification,
} = require("../../utils/activityAndNotificationHelpers");
const EventRegistered = require("../../models/eventRegistrations.model");
const emailProvider = require("../emails/emailProvider");
const moment = require("moment-timezone");

exports.eventReminder = async () => {
  try {
    const events = await Event.find({
      dateTime: { $gte: moment(), $lt: moment().add(2, "days") },
    });
    events.map((event) => {
      const duration = moment(event.dateTime).diff(moment(), "minutes");
      if (duration <= 60 && duration > 45) {
        this.sendEventMail(event);
      }
    });
  } catch (error) {
    console.error(error.message);
  }
};

exports.sendEventMail = async (event) => {
  const participantsList = [];
  try {
    const users = await EventRegistered.find({ eventId: { $eq: event._id } });
    for (let i = 0; i < users.length; i++) {
      sendNotification(
        users[i].userId,
        "Event",
        `${event.title} is starting soon.`
      );
      const userDetail = await User.find(
        { _id: { $eq: users[i].userId } },
        { email: 1 }
      );
      participantsList.push(userDetail[0].email);
    }
    emailProvider.sendEventReminder(event, participantsList);
  } catch (error) {
    console.error(error.message);
  }
};

exports.courseReminder = async () => {
  try {
    const courses = await Course.find({
      startDate: { $gte: moment(), $lt: moment().add(2, "days") },
    });
    courses.map((course) => {
      const duration = moment(course.startDate).diff(moment(), "minutes");
      if (duration <= 60 && duration > 45) {
        this.sendCourseMail(course);
      }
    });
  } catch (error) {
    console.error(error.message);
  }
};

exports.sendCourseMail = async (course) => {
  const participantsList = [];
  try {
    const users = await EventRegistered.find({ courseId: { $eq: course._id } });
    for (let i = 0; i < users.length; i++) {
      sendNotification(
        users[i].userId,
        "Course",
        `${course.title} is starting soon.`
      );
      const userDetail = await User.find(
        { _id: { $eq: users[i].userId } },
        { email: 1 }
      );
      participantsList.push(userDetail[0].email);
    }
    emailProvider.sendCourseReminder(course, participantsList);
  } catch (error) {
    console.error(error.message);
  }
};
