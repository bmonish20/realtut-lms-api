/**
 *
 * Course
 *
 */

const express = require("express");
const validate = require("express-validation");
const controller = require("../../controllers/course.controller");
const registerController = require("../../controllers/eventRegistrations.controller");
const {
  authorize,
  LOGGED_USER,
  ADMIN,
  TRAINER,
} = require("../../middlewares/auth");
const {
  createCourse,
  fetchCourse,
  updateCourse,
  deleteCourse,
  listCourse,
  registerCourse,
  removeRegistration,
  listRegistrations,
  updateProgress,
} = require("../../validations/course.validation");

const router = express.Router();

router
  .route("/all")
  /**
   * @api {get} v1/course/all List courses
   * @apiDescription Get a list of courses
   * @apiVersion 1.0.0
   * @apiName Listcourse
   * @apiGroup course
   * @apiPermission logged user
   *
   * @apiHeader {String} Authorization   User's access token
   *
   * @apiParam  {Number{1-}}         [page=1]           List page
   * @apiParam  {Number{1-100}}      [perPage=1]        Courses per page
   * @apiParam  {String}             [fields=id title]  Fields to be fetched
   *
   * @apiSuccess {Object[]} List of courses.
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .get(authorize(LOGGED_USER), validate(listCourse), controller.list);

router
  .route("/my")
  .get(authorize(LOGGED_USER), validate(listCourse), controller.my);

router
  .route("")
  /**
   * @api {Post} v1/course Create course
   * @apiDescription Create an course
   * @apiVersion 1.0.0
   * @apiName Createcourse
   * @apiGroup course
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization          User's access token
   *
   * @apiParam   title             Course's Title
   * @apiParam   type              Course's type
   * @apiParam   startDate         Course's startDate
   * @apiParam   duration          Course's duration
   * @apiParam   shortDescription  Course's shortDescription
   * @apiParam   courseLink        Course's courseLink
   * @apiParam   tags              Course's tags
   * @apiParam   prerequisite      Course's prerequisite
   *
   * @apiSuccess (Created 201)  {String}  title  Course title
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .post(authorize([ADMIN, TRAINER]), validate(createCourse), controller.create);

router
  .route("/:courseId")
  /**
   * @api {GET} v1/course/:courseId Get course Details
   * @apiDescription Get a course Details
   * @apiVersion 1.0.0
   * @apiName Fetchcourse
   * @apiGroup course
   * @apiPermission Logged User
   *
   * @apiHeader {String} Authorization          User's access token
   *
   * @apiParam   {String}  courseId  course's Id
   *
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .get(authorize(LOGGED_USER), validate(fetchCourse), controller.fetch)
  /**
   * @api {Post} v1/course/:courseId Update course
   * @apiDescription Update an course
   * @apiVersion 1.0.0
   * @apiName Updatecourse
   * @apiGroup course
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization          User's access token
   *
   * @apiParam {String}  courseId                course's Id
   *
   *
   * @apiSuccess (No Content 204)                course updated
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .patch(
    authorize([ADMIN, TRAINER]),
    validate(updateCourse),
    controller.updateOne
  )
  /**
   * @api {DELETE} v1/course/:courseId course event
   * @apiDescription DELETE a course
   * @apiVersion 1.0.0
   * @apiName Deletecourse
   * @apiGroup course
   * @apiPermission Admin
   *
   * @apiHeader {String} Authorization           User's access token
   *
   * @apiParam   {String}  courseId               course's Id
   *
   * @apiSuccess (No Content 204)                course deleted
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .delete(
    authorize([ADMIN, TRAINER]),
    validate(deleteCourse),
    controller.removeOne
  );

router
  .route("/registrations/all")
  /**
   * @api {GET} v1/course/registrations List Registrations
   * @apiDescription Get a list of registrations
   * @apiVersion 1.0.0
   * @apiName List Registrations
   * @apiGroup course
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization   User's access token
   *
   * @apiParam  {Number{1-}}         [page=1]           List page
   * @apiParam  {Number{1-100}}      [perPage=1]        registrations per page
   * @apiParam  {String}             [fields=id title]  Fields to be fetched
   *
   * @apiSuccess {Object[]} List of registrations.
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only owners can access the data
   */
  .get(
    authorize(ADMIN),
    validate(listRegistrations),
    registerController.listCourseRegistrations
  );

router
  .route("/:courseId/register")
  /**
   * @api {Post} v1/course/:courseId/register Register to course
   * @apiDescription Register to the course
   * @apiVersion 1.0.0
   * @apiName RegisterToCourse
   * @apiGroup course
   * @apiPermission logged user
   *
   * @apiHeader {String} Authorization           User's access token
   *
   * @apiParam {String}  courseId                 course's Id
   *
   * @apiSuccess (No Content 204)                User successfully registered to event
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .post(
    authorize(LOGGED_USER),
    validate(registerCourse),
    registerController.registerToCourse
  )
  /**
   * @api {DELETE} v1/course/:courseId/register Delete registration to course
   * @apiDescription Delete registration to course
   * @apiVersion 1.0.0
   * @apiName DeleteRegistrationToCourse
   * @apiGroup event
   * @apiPermission logged user
   *
   * @apiHeader {String} Authorization           User's access token
   *
   * @apiParam {String}  courseId                 course's Id
   *
   * @apiSuccess (No Content 204)                Registration successfully deleted
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .delete(
    authorize(LOGGED_USER),
    validate(removeRegistration),
    registerController.deleteCourseRegistration
  );

router
  .route("/:courseId/progress")
  /**
   * @api {Post} v1/course/:courseId/progress Update course progress
   * @apiDescription Update course progress
   * @apiVersion 1.0.0
   * @apiName Update course Progress
   * @apiGroup course
   * @apiPermission logged user
   *
   * @apiHeader {String} Authorization           User's access token
   *
   * @apiParam {String}  courseId                course's Id
   *
   * @apiParam {Number}  courseProgress          course progress
   *
   * @apiSuccess (No Content 204)                User successfully registered to event
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .post(
    authorize(LOGGED_USER),
    validate(updateProgress),
    registerController.updateCourseProgress
  );

module.exports = router;
