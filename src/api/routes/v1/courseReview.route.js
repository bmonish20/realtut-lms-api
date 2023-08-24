/**
 *
 * CourseReview
 *
 */

const express = require("express");
const validate = require("express-validation");
const controller = require("../../controllers/courseReview.controller");
const { authorize, LOGGED_USER, ADMIN } = require("../../middlewares/auth");
const {
  review,
  updateReview,
  listReviews,
} = require("../../validations/courseReview.validation");

const router = express.Router();

router
  .route("/reviews/all")
  /**
   * @api {GET} v1/course/reviews/all List Reviews
   * @apiDescription Get a list of reviews
   * @apiVersion 1.0.0
   * @apiName List Reviews
   * @apiGroup course
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization   User's access token
   *
   * @apiParam  {Number{1-}}         [page=1]           List page
   * @apiParam  {Number{1-100}}      [perPage=1]        reviews per page
   * @apiParam  {String}             [fields=id title]  Fields to be fetched
   *
   * @apiSuccess {Object[]} List of reviews.
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only owners can access the data
   */
  .get(authorize(ADMIN), validate(listReviews), controller.list);

router
  .route("/:courseId/review")
  /**
   * @api {POST} v1/course/:courseId/review Create courseReview
   * @apiDescription Create an courseReview
   * @apiVersion 1.0.0
   * @apiName CreatecourseReview
   * @apiGroup course
   * @apiPermission logged user
   *
   * @apiHeader {String} Authorization          User's access token
   *
   * @apiParam {String} courseId            Course's Id'
   *
   * @apiSuccess (Created 201)              User successfully reviewed course
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .post(authorize(LOGGED_USER), validate(review), controller.review);

router
  .route("/:courseReviewId/review")
  /**
   * @api {PATCH} v1/course/:courseReviewId/review Update course review
   * @apiDescription Update a courseReview
   * @apiVersion 1.0.0
   * @apiName UpdatecourseReview
   * @apiGroup course
   * @apiPermission logged user
   *
   * @apiHeader {String} Authorization           User's access token
   *
   * @apiParam   {String}  courseReviewId             course Review's Id
   *
   * @apiSuccess (No Content 204)                courseReview deleted
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .patch(authorize(LOGGED_USER), validate(updateReview), controller.updateOne);

module.exports = router;
