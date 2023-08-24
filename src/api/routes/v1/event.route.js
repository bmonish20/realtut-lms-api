const express = require("express");
const validate = require("express-validation");
const controller = require("../../controllers/event.controller");
const {
  authorize,
  LOGGED_USER,
  ADMIN,
  TRAINER,
} = require("../../middlewares/auth");
const {
  createEvent,
  listEvents,
  fetchEvent,
  updateEvent,
  deleteEvent,
} = require("../../validations/event.validation");

const router = express.Router();

router
  .route("/all")
  /**
   * @api {get} v1/event/all List events
   * @apiDescription Get a list of events
   * @apiVersion 1.0.0
   * @apiName Listevent
   * @apiGroup event
   * @apiPermission logged user
   *
   * @apiHeader {String} Authorization   User's access token
   *
   * @apiParam  {Number{1-}}         [page=1]           List page
   * @apiParam  {Number{1-100}}      [perPage=1]        Events per page
   * @apiParam  {String}             [fields=id title]  Fields to be fetched
   *
   * @apiSuccess {Object[]} List of events.
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .get(authorize(LOGGED_USER), validate(listEvents), controller.list);

router
  .route("/date")
  /**
   * @api {get} v1/event/date List events
   * @apiDescription Get a list of events
   * @apiVersion 1.0.0
   * @apiName Listevent
   * @apiGroup event
   * @apiPermission logged user
   *
   * @apiHeader {String} Authorization   User's access token
   *
   * @apiParam  {Number{1-}}         [page=1]           List page
   * @apiParam  {Number{1-100}}      [perPage=1]        Events per page
   * @apiParam  {String}             [fields=id title]  Fields to be fetched
   *
   * @apiSuccess {Object[]} List of events.
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .get(authorize(LOGGED_USER), validate(listEvents), controller.listByDate);

router
  .route("")
  /**
   * @api {Post} v1/event Create event
   * @apiDescription Create an event
   * @apiVersion 1.0.0
   * @apiName Createevent
   * @apiGroup event
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization          User's access token
   * @apiParam {String}  title                  event's Title
   * @apiParam {Date}    dateTime               event's Date
   * @apiParam {String}  webinarLink            event's link
   * @apiParam {String}  hostedBy               event's imageUrl
   * @apiParam {String}  hostedByPictureUrl     event's hostedByPictureUrl
   * @apiParam {String}  shortDescription       event's shortDescription
   * @apiParam {String}  participants           event's participants
   * @apiParam {String}  description            event's description
   * @apiParam {String}  tags                   event's tags
   *
   * @apiSuccess (Created 201) {String}  title        event's Title
   * @apiSuccess (Created 201) {Date}    dateTime         event's Date
   * @apiSuccess (Created 201) {String}  description  event's Description
   * @apiSuccess (Created 201) {String}  hostedBy     event's hostedBy
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .post(authorize([ADMIN, TRAINER]), validate(createEvent), controller.create);

router
  .route("/:eventId")
  /**
   * @api {GET} v1/event/:eventId Get event Details
   * @apiDescription Get a event Details
   * @apiVersion 1.0.0
   * @apiName Fetchevent
   * @apiGroup event
   * @apiPermission Logged User
   *
   * @apiHeader {String} Authorization          User's access token
   *
   * @apiParam   {String}  eventId              event's Id
   *
   * @apiSuccess {String}  title                  event's Title
   * @apiSuccess {Date}    dateTime               event's Date
   * @apiSuccess {String}  WebinarLink            event's link
   * @apiSuccess {String}  hostedBy               event's imageUrl
   * @apiSuccess {String}  hostedByPictureUrl     event's hostedByPictureUrl
   * @apiSuccess {String}  shortDescription       event's shortDescription
   * @apiSuccess {String}  participants           event's participants
   * @apiSuccess {String}  description            event's description
   * @apiSuccess {String}  tags                   event's tags
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .get(authorize(LOGGED_USER), validate(fetchEvent), controller.fetch)
  /**
   * @api {Post} v1/event/:eventId Update event
   * @apiDescription Update an event
   * @apiVersion 1.0.0
   * @apiName Updateevent
   * @apiGroup event
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization          User's access token
   *
   * @apiParam {String}  eventId                event's Id
   *
   * @apiParam {String}  title                  event's Title
   * @apiParam {Date}    dateTime               event's Date
   * @apiParam {String}  webinarLink            event's link
   * @apiParam {String}  hostedBy               event's imageUrl
   * @apiParam {String}  hostedByPictureUrl     event's hostedByPictureUrl
   * @apiParam {String}  shortDescription       event's shortDescription
   * @apiParam {String}  participants           event's participants
   * @apiParam {String}  description            event's description
   * @apiParam {String}  tags                   event's tags
   *
   * @apiSuccess (No Content 204)                Event updated
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .patch(
    authorize([ADMIN, TRAINER]),
    validate(updateEvent),
    controller.updateOne
  )
  /**
   * @api {DELETE} v1/event/:eventId Delete event
   * @apiDescription DELETE a event
   * @apiVersion 1.0.0
   * @apiName Deleteevent
   * @apiGroup event
   * @apiPermission Admin
   *
   * @apiHeader {String} Authorization           User's access token
   *
   * @apiParam   {String}  eventId               Event's Id
   *
   * @apiSuccess (No Content 204)                Event deleted
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .delete(
    authorize([ADMIN, TRAINER]),
    validate(deleteEvent),
    controller.removeOne
  );

module.exports = router;
