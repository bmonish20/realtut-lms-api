/**
 *
 * Client
 *
 */

const express = require("express");
const validate = require("express-validation");
const controller = require("../../controllers/client.controller");
const {
  authorize,
  LOGGED_USER,
  ADMIN,
  TRAINER,
} = require("../../middlewares/auth");
const {
  listClient,
  createClient,
  fetchClient,
  updateClient,
  deleteClient,
} = require("../../validations/client.validation");

const router = express.Router();

router
  .route("/all")
  /**
   * @api {GET} v1/client/all List client
   * @apiDescription Get a list of client
   * @apiVersion 1.0.0
   * @apiName Listclient
   * @apiGroup client
   * @apiPermission logged user
   *
   * @apiHeader {String} Authorization   User's access token
   *
   * @apiParam  {Number{1-}}         [page=1]           List page
   * @apiParam  {Number{1-100}}      [perPage=1]        clients per page
   * @apiParam  {String}             [fields=id title]  Fields to be fetched
   *
   * @apiSuccess {Object[]} List of clients.
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .get(authorize(LOGGED_USER), validate(listClient), controller.list);

router
  .route("")
  /**
   * @api {POST} v1/client Create client
   * @apiDescription Create an client
   * @apiVersion 1.0.0
   * @apiName Createclient
   * @apiGroup client
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization          User's access token
   *
   * @apiParam  {String}             name             client's name
   *
   * @apiSuccess (Created 201) {String}  id         client's id
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .post(authorize([ADMIN, TRAINER]), validate(createClient), controller.create);

router
  .route("/:clientId")
  /**
   * @api {GET} v1/client/:clientId Get client Details
   * @apiDescription Get a client Details
   * @apiVersion 1.0.0
   * @apiName Fetchclient
   * @apiGroup client
   * @apiPermission Logged User
   *
   * @apiHeader {String} Authorization          User's access token
   *
   * @apiParam   {String}  clientId  client's Id
   *
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .get(authorize(LOGGED_USER), validate(fetchClient), controller.fetch)
  /**
   * @api {PATCH} v1/client/:clientId Update client
   * @apiDescription Update an client
   * @apiVersion 1.0.0
   * @apiName Updateclient
   * @apiGroup client
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization          User's access token
   *
   * @apiParam {String}  clientId                client's Id
   *
   *
   * @apiSuccess (No Content 204)                client updated
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .patch(
    authorize([ADMIN, TRAINER]),
    validate(updateClient),
    controller.updateOne
  )
  /**
   * @api {DELETE} v1/client/:clientId client event
   * @apiDescription DELETE a client
   * @apiVersion 1.0.0
   * @apiName Deleteclient
   * @apiGroup client
   * @apiPermission Admin
   *
   * @apiHeader {String} Authorization           User's access token
   *
   * @apiParam   {String}  clientId               client's Id
   *
   * @apiSuccess (No Content 204)                client deleted
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .delete(
    authorize([ADMIN, TRAINER]),
    validate(deleteClient),
    controller.removeOne
  );

module.exports = router;
