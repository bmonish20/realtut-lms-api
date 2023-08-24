/**
 *
 * EventRegistrations
 *
 */

const httpStatus = require("http-status");
const EventRegistration = require("../models/eventRegistrations.model");
const Event = require("../models/event.model");
const User = require("../models/user.model");
const Course = require("../models/course.model");
const emailProvider = require("../services/emails/emailProvider");
const { createActivity } = require("../utils/activityAndNotificationHelpers");

exports.listCourseRegistrations = async (req, res, next) => {
  try {
    const courseRegistrations = await EventRegistration.listEnrolledCourses(
      req.query
    );
    res.json(courseRegistrations);
  } catch (error) {
    next(error);
  }
};

exports.registerToEvent = async (req, res, next) => {
  try {
    const { eventId } = req.params;
    const registration = new EventRegistration({
      eventId,
      userId: req.user._id,
    });
    await registration.save();
    const eventDetails = await Event.findById(eventId);
    const userDetails = await User.findById(req.user._id);
    emailProvider.sendEventRegistered(eventDetails, userDetails);
    createActivity(
      req.user._id,
      "event",
      `Registered for ${eventDetails.title}`
    );
    res.status(httpStatus.NO_CONTENT);
    res.send();
  } catch (error) {
    next(error);
  }
};

exports.registerToCourse = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const registration = new EventRegistration({
      courseId,
      userId: req.user._id,
    });
    const userDetails = await User.findById(req.user._id);
    const courseDetails = await Course.findById(courseId);
    await registration.save();
    emailProvider.sendCourseRegistered(courseDetails, userDetails);
    createActivity(
      req.user._id,
      "course",
      `Registered for ${courseDetails.title}`
    );
    res.status(httpStatus.NO_CONTENT);
    res.send();
  } catch (error) {
    next(error);
  }
};

exports.deleteEventRegistration = async (req, res, next) => {
  try {
    const { eventId } = req.params;
    const event = await Event.findById(eventId);
    await EventRegistration.deleteOne({ eventId, userId: req.user._id });
    createActivity(req.user._id, "event", `Unregistered for ${event.title}`);
    res.status(httpStatus.NO_CONTENT);
    res.send();
  } catch (error) {
    next(error);
  }
};

exports.deleteCourseRegistration = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId);
    await EventRegistration.deleteOne({ courseId, userId: req.user._id });
    createActivity(req.user._id, "course", `Unregistered for ${course.title}`);
    res.status(httpStatus.NO_CONTENT);
    res.send();
  } catch (error) {
    next(error);
  }
};

exports.updateCourseProgress = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId);
    await EventRegistration.updateCourseProgress({
      courseId,
      userId: req.user._id,
      ...req.body,
    });
    createActivity(
      req.user._id,
      "course",
      `Progressed to the next chapter in ${course.title}`
    );
    res.status(httpStatus.NO_CONTENT);
    res.send();
  } catch (error) {
    next(error);
  }
};
