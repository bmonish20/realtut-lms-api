/**
 *
 * Notification
 *
 */

const express = require("express");
const validate = require("express-validation");
const controller = require("../../controllers/notification.controller");
const { authorize, LOGGED_USER } = require("../../middlewares/auth");
const {
  listNotification,
  updateNotification,
} = require("../../validations/notification.validation");

const router = express.Router();

router
  .route("/all")
  /**
   * @api {GET} v1/notification/all List notification
   * @apiDescription Get a list of notification
   * @apiVersion 1.0.0
   * @apiName Listnotification
   * @apiGroup notification
   * @apiPermission logged user
   *
   * @apiHeader {String} Authorization   User's access token
   *
   * @apiParam  {Number{1-}}         [page=1]           List page
   * @apiParam  {Number{1-100}}      [perPage=1]        notifications per page
   * @apiParam  {String}             [fields=id title]  Fields to be fetched
   *
   * @apiSuccess {Object[]} List of notifications.
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .get(authorize(LOGGED_USER), validate(listNotification), controller.list);

router
  .route("/:notificationId")
  /**
   * @api {PATCH} v1/notification/:notificationId Update notification
   * @apiDescription Update an notification
   * @apiVersion 1.0.0
   * @apiName Updatenotification
   * @apiGroup notification
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization          User's access token
   *
   * @apiParam {String}  notificationId                notification's Id
   *
   *
   * @apiSuccess (No Content 204)                notification updated
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .patch(
    authorize(LOGGED_USER),
    validate(updateNotification),
    controller.updateOne
  );

module.exports = router;
