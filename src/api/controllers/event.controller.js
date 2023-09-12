const httpStatus = require("http-status");
const Event = require("../models/event.model");
const Registrations = require("../models/eventRegistrations.model");
const { createActivity } = require("../utils/activityAndNotificationHelpers");
const ZoomService = require("../services/zoom");

exports.list = async (req, res, next) => {
  try {
    const events = await Event.list({ ...req.query, userId: req.user._id });
    res.json(events);
  } catch (error) {
    next(error);
  }
};

exports.listByDate = async (req, res, next) => {
  try {
    const events = await Event.list({
      ...req.query,
      userId: req.user._id,
    });
    res.json(events);
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    // const meeting = await ZoomService.createMeeting({
    //   ...req.body,
    // });
    const event = new Event({
      ...req.body,
      hostedBy: req.user._id,
      webinarLink: "132",
    });
    const savedEvent = await event.save();
    createActivity(req.user._id, "event", `Created ${savedEvent.title}`);
    res.status(httpStatus.CREATED);
    res.json(savedEvent);
  } catch (error) {
    next(error);
  }
};

exports.fetch = async (req, res, next) => {
  try {
    const { eventId } = req.params;
    const event = await Event.fetch({ id: eventId, role: req.user.role });
    const isRegistered = await Registrations.IsUserRegisteredToEvent({
      eventId,
      userId: req.user._id,
    });
    const response = { ...event, isUserRegistered: isRegistered };
    res.json(response);
  } catch (error) {
    next(error);
  }
};

exports.updateOne = async (req, res, next) => {
  try {
    const { eventId: id } = req.params;
    // await ZoomService.updateMeeting(req.body.webinarLink, req.body);
    await Event.updateEvent({ id }, req.body);
    createActivity(req.user._id, "event", `Updated ${req.body.title}`);
    res.status(httpStatus.NO_CONTENT);
    res.send();
  } catch (error) {
    next(error);
  }
};

exports.removeOne = async (req, res, next) => {
  try {
    const { eventId: _id } = req.params;
    const event = await Event.findById(_id);
    await Event.deleteOne({ _id });
    createActivity(req.user._id, "event", `Deleted ${event.title}`);
    res.status(httpStatus.NO_CONTENT);
    res.send();
  } catch (error) {
    next(error);
  }
};
