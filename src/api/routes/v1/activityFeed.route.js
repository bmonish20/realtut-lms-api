/**
*
* ActivityFeed
*
*/

const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/activityFeed.controller');
const { authorize, LOGGED_USER} = require('../../middlewares/auth');
const {
  listActivityFeed,
} = require('../../validations/activityFeed.validation');

const router = express.Router();

router.route('/all')
  /**
   * @api {GET} v1/activityFeed/all List activityFeed
   * @apiDescription Get a list of activityFeed
   * @apiVersion 1.0.0
   * @apiName ListactivityFeed
   * @apiGroup activityFeed
   * @apiPermission logged user
   *
   * @apiHeader {String} Authorization   User's access token
   *
   * @apiParam  {Number{1-}}         [page=1]           List page
   * @apiParam  {Number{1-100}}      [perPage=1]        activityFeeds per page
   * @apiParam  {String}             [fields=id title]  Fields to be fetched
   *
   * @apiSuccess {Object[]} List of activityFeeds.
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .get(authorize(LOGGED_USER), validate(listActivityFeed), controller.list);

module.exports = router;
