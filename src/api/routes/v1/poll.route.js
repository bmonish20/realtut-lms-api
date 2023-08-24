/**
 *
 * Poll
 *
 */

const express = require("express");
const validate = require("express-validation");
const controller = require("../../controllers/poll.controller");
const {
  authorize,
  LOGGED_USER,
  ADMIN,
  TRAINER,
} = require("../../middlewares/auth");
const {
  listPoll,
  createPoll,
  fetchPoll,
  updatePoll,
  deletePoll,
} = require("../../validations/poll.validation");

const router = express.Router();

router
  .route("/all")
  /**
   * @api {GET} v1/poll/all List poll
   * @apiDescription Get a list of poll
   * @apiVersion 1.0.0
   * @apiName Listpoll
   * @apiGroup poll
   * @apiPermission logged user
   *
   * @apiHeader {String} Authorization   User's access token
   *
   * @apiParam  {Number{1-}}         [page=1]           List page
   * @apiParam  {Number{1-100}}      [perPage=1]        polls per page
   * @apiParam  {String}             [fields=id title]  Fields to be fetched
   *
   * @apiSuccess {Object[]} List of polls.
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .get(authorize(LOGGED_USER), validate(listPoll), controller.list);

router
  .route("/my")
  /**
   * @api {GET} v1/poll/my List My poll
   * @apiDescription Get a list of my poll
   * @apiVersion 1.0.0
   * @apiName Listpoll
   * @apiGroup poll
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization   User's access token
   *
   * @apiParam  {Number{1-}}         [page=1]           List page
   * @apiParam  {Number{1-100}}      [perPage=1]        polls per page
   * @apiParam  {String}             [fields=id title]  Fields to be fetched
   *
   * @apiSuccess {Object[]} List of polls.
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .get(authorize([ADMIN, TRAINER]), validate(listPoll), controller.my);

router
  .route("")
  /**
   * @api {POST} v1/poll Create poll
   * @apiDescription Create an poll
   * @apiVersion 1.0.0
   * @apiName Createpoll
   * @apiGroup poll
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization          User's access token
   *
   * @apiParam title      Poll's Name
   * @apiParam courseId   Poll's associated Course
   * @apiParam options    Poll's McQ Options
   *
   * @apiSuccess (Created 201) title Poll's title
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .post(authorize([ADMIN, TRAINER]), validate(createPoll), controller.create);

router
  .route("/:pollId")
  /**
   * @api {GET} v1/poll/:pollId Get poll Details
   * @apiDescription Get a poll Details
   * @apiVersion 1.0.0
   * @apiName Fetchpoll
   * @apiGroup poll
   * @apiPermission Logged User
   *
   * @apiHeader {String} Authorization          User's access token
   *
   * @apiParam   {String}  pollId  poll's Id
   *
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .get(authorize(LOGGED_USER), validate(fetchPoll), controller.fetch)
  /**
   * @api {PATCH} v1/poll/:pollId Update poll
   * @apiDescription Update an poll
   * @apiVersion 1.0.0
   * @apiName Updatepoll
   * @apiGroup poll
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization          User's access token
   *
   * @apiParam {String}  pollId                poll's Id
   *
   *
   * @apiSuccess (No Content 204)                poll updated
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .patch(authorize(LOGGED_USER), validate(updatePoll), controller.updateOne)
  /**
   * @api {DELETE} v1/poll/:pollId poll event
   * @apiDescription DELETE a poll
   * @apiVersion 1.0.0
   * @apiName Deletepoll
   * @apiGroup poll
   * @apiPermission Admin
   *
   * @apiHeader {String} Authorization           User's access token
   *
   * @apiParam   {String}  pollId               poll's Id
   *
   * @apiSuccess (No Content 204)                poll deleted
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .delete(
    authorize([ADMIN, TRAINER]),
    validate(deletePoll),
    controller.removeOne
  );

module.exports = router;
