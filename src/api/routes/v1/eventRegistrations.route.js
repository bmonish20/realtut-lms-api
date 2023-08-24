/**
*
* EventRegistrations
*
*/

const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/eventRegistrations.controller');
const { authorize, LOGGED_USER, ADMIN, TRAINER } = require('../../middlewares/auth');
const {
  register,
  removeRegistration
} = require('../../validations/eventRegistrations.validation');

const router = express.Router();

router.route('/:eventId/register')
  /**
   * @api {Post} v1/event/:eventId/register Register to event
   * @apiDescription Register to the event
   * @apiVersion 1.0.0
   * @apiName RegisterToEvent
   * @apiGroup event
   * @apiPermission logged user
   *
   * @apiHeader {String} Authorization           User's access token
   * 
   * @apiParam {String}  eventId                 event's Id
   *
   * @apiSuccess (No Content 204)                User successfully registered to event
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .post(authorize(LOGGED_USER), validate(register), controller.registerToEvent)
  /**
   * @api {DELETE} v1/event/:eventId/register Delete registration to event
   * @apiDescription Delete registration to event
   * @apiVersion 1.0.0
   * @apiName DeleteRegistrationToEvent
   * @apiGroup event
   * @apiPermission logged user
   *
   * @apiHeader {String} Authorization           User's access token
   * 
   * @apiParam {String}  eventId                 event's Id
   *
   * @apiSuccess (No Content 204)                Registration successfully deleted
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .delete(authorize(LOGGED_USER), validate(removeRegistration), controller.deleteEventRegistration);

module.exports = router;
