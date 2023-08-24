/**
 *
 * InviteUser
 *
 */

const express = require("express");
const validate = require("express-validation");
const controller = require("../../controllers/inviteUser.controller");
const {
  authorize,
  LOGGED_USER,
  ADMIN,
  TRAINER,
} = require("../../middlewares/auth");
const {
  listInviteUser,
  createInviteUser,
  fetchInviteUser,
  updateInviteUser,
  deleteInviteUser,
} = require("../../validations/inviteUser.validation");

const router = express.Router();

router
  .route("/all")
  /**
   * @api {GET} v1/inviteUser/all List inviteUser
   * @apiDescription Get a list of inviteUser
   * @apiVersion 1.0.0
   * @apiName ListinviteUser
   * @apiGroup inviteUser
   * @apiPermission logged user
   *
   * @apiHeader {String} Authorization   User's access token
   *
   * @apiParam  {Number{1-}}         [page=1]           List page
   * @apiParam  {Number{1-100}}      [perPage=1]        inviteUsers per page
   * @apiParam  {String}             [fields=id title]  Fields to be fetched
   *
   * @apiSuccess {Object[]} List of inviteUsers.
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .get(authorize(LOGGED_USER), validate(listInviteUser), controller.list);

router
  .route("")
  /**
   * @api {POST} v1/inviteUser Create inviteUser
   * @apiDescription Create an inviteUser
   * @apiVersion 1.0.0
   * @apiName CreateinviteUser
   * @apiGroup inviteUser
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization          User's access token
   *
   * @apiParam name       Invited User's Name
   * @apiParam email       Invited User's Email
   *
   * @apiSuccess (Created 201)  name       Invited User's Name
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .post(authorize([ADMIN]), validate(createInviteUser), controller.create);

router
  .route("/:inviteUserId")
  /**
   * @api {GET} v1/inviteUser/:inviteUserId Get inviteUser Details
   * @apiDescription Get a inviteUser Details
   * @apiVersion 1.0.0
   * @apiName FetchinviteUser
   * @apiGroup inviteUser
   * @apiPermission Logged User
   *
   * @apiHeader {String} Authorization          User's access token
   *
   * @apiParam   {String}  inviteUserId  inviteUser's Id
   *
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .get(authorize(LOGGED_USER), validate(fetchInviteUser), controller.fetch)
  /**
   * @api {PATCH} v1/inviteUser/:inviteUserId Update inviteUser
   * @apiDescription Update an inviteUser
   * @apiVersion 1.0.0
   * @apiName UpdateinviteUser
   * @apiGroup inviteUser
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization          User's access token
   *
   * @apiParam {String}  inviteUserId                inviteUser's Id
   *
   *
   * @apiSuccess (No Content 204)                inviteUser updated
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .patch(
    authorize([ADMIN, TRAINER]),
    validate(updateInviteUser),
    controller.updateOne
  )
  /**
   * @api {DELETE} v1/inviteUser/:inviteUserId inviteUser event
   * @apiDescription DELETE a inviteUser
   * @apiVersion 1.0.0
   * @apiName DeleteinviteUser
   * @apiGroup inviteUser
   * @apiPermission Admin
   *
   * @apiHeader {String} Authorization           User's access token
   *
   * @apiParam   {String}  inviteUserId               inviteUser's Id
   *
   * @apiSuccess (No Content 204)                inviteUser deleted
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .delete(
    authorize([ADMIN, TRAINER]),
    validate(deleteInviteUser),
    controller.removeOne
  );

module.exports = router;
