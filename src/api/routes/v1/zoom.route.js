const express = require('express');
const validate = require('express-validation');
const { authorize, LOGGED_USER, ADMIN, TRAINER } = require('../../middlewares/auth');
const { token } = require('../../controllers/zoom.controller');
const { tokenValidation } = require('../../validations/zoom.validation');

const router = express.Router();

router.route('/token')
  /**
   * @api {get} v1/zoom/token Get Zoom token
   * @apiDescription Get a token to join zoom meeting
   * @apiVersion 1.0.0
   * @apiName GetToken
   * @apiGroup zoom
   * @apiPermission logged user
   *
   * @apiHeader {String} Authorization   User's access token
   *
   * @apiParam  {Number{1-}}         [meetingId=1]   Meeting's ID
   * @apiParam  {Number{1-100}}      [role=1]        If its for Host
   *
   * @apiSuccess {Object[]} Credentials to join the meeting.
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .get(authorize(LOGGED_USER), validate(tokenValidation), token);

module.exports = router;