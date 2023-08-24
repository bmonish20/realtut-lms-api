/**
 *
 * Forum
 *
 */

const express = require("express");
const validate = require("express-validation");
const controller = require("../../controllers/forum.controller");
const {
  authorize,
  LOGGED_USER,
  ADMIN,
  TRAINER,
} = require("../../middlewares/auth");
const {
  listForum,
  createForum,
  fetchForum,
  updateForum,
  deleteForum,
} = require("../../validations/forum.validation");

const router = express.Router();

router
  .route("/all")
  /**
   * @api {GET} v1/forum/all List forum
   * @apiDescription Get a list of forum
   * @apiVersion 1.0.0
   * @apiName Listforum
   * @apiGroup forum
   * @apiPermission logged user
   *
   * @apiHeader {String} Authorization   User's access token
   *
   * @apiParam  {Number{1-}}         [page=1]           List page
   * @apiParam  {Number{1-100}}      [perPage=1]        forums per page
   * @apiParam  {String}             [fields=id title]  Fields to be fetched
   *
   * @apiSuccess {Object[]} List of forums.
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .get(authorize(LOGGED_USER), validate(listForum), controller.list);

router
  .route("")
  /**
   * @api {POST} v1/forum Create forum
   * @apiDescription Create an forum
   * @apiVersion 1.0.0
   * @apiName Createforum
   * @apiGroup forum
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization          User's access token
   *
   * @apiParam message   Forum Message
   * @apiParam dateTime  Forum Message Date Time
   * @apiParam courseId  Forum Course ID
   *
   * @apiSuccess (Created 201) message Forum Message
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .post(authorize(LOGGED_USER), validate(createForum), controller.create);

router
  .route("/:forumId")
  /**
   * @api {GET} v1/forum/:forumId Get forum Details
   * @apiDescription Get a forum Details
   * @apiVersion 1.0.0
   * @apiName Fetchforum
   * @apiGroup forum
   * @apiPermission Logged User
   *
   * @apiHeader {String} Authorization          User's access token
   *
   * @apiParam   {String}  forumId  forum's Id
   *
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .get(authorize(LOGGED_USER), validate(fetchForum), controller.fetch)
  /**
   * @api {PATCH} v1/forum/:forumId Update forum
   * @apiDescription Update an forum
   * @apiVersion 1.0.0
   * @apiName Updateforum
   * @apiGroup forum
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization          User's access token
   *
   * @apiParam {String}  forumId                forum's Id
   *
   *
   * @apiSuccess (No Content 204)                forum updated
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .patch(
    authorize([ADMIN, TRAINER]),
    validate(updateForum),
    controller.updateOne
  )
  /**
   * @api {DELETE} v1/forum/:forumId forum event
   * @apiDescription DELETE a forum
   * @apiVersion 1.0.0
   * @apiName Deleteforum
   * @apiGroup forum
   * @apiPermission Admin
   *
   * @apiHeader {String} Authorization           User's access token
   *
   * @apiParam   {String}  forumId               forum's Id
   *
   * @apiSuccess (No Content 204)                forum deleted
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .delete(
    authorize([ADMIN, TRAINER]),
    validate(deleteForum),
    controller.removeOne
  );

module.exports = router;
