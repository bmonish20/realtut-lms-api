const express = require("express");
const validate = require("express-validation");
const controller = require("../../controllers/quiz.controller");
const {
  authorize,
  LOGGED_USER,
  ADMIN,
  TRAINER,
} = require("../../middlewares/auth");
const {
  listQuiz,
  createQuiz,
  fetchQuiz,
  updateQuiz,
  deleteQuiz,
} = require("../../validations/quiz.validation");

const router = express.Router();

router
  .route("/all")
  /**
   * @api {GET} v1/quiz/all List quiz
   * @apiDescription Get a list of quiz
   * @apiVersion 1.0.0
   * @apiName Listquiz
   * @apiGroup quiz
   * @apiPermission logged user
   *
   * @apiHeader {String} Authorization   User's access token
   *
   * @apiParam  {Number{1-}}         [page=1]           List page
   * @apiParam  {Number{1-100}}      [perPage=1]        quizs per page
   * @apiParam  {String}             [fields=id title]  Fields to be fetched
   *
   * @apiSuccess {Object[]} List of quizs.
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .get(authorize(LOGGED_USER), validate(listQuiz), controller.list);

router
  .route("/my")
  /**
   * @api {GET} v1/quiz/my List my quizzes
   * @apiDescription Get a list of my quizzes
   * @apiVersion 1.0.0
   * @apiName ListMyQuiz
   * @apiGroup quiz
   * @apiPermission logged user
   *
   * @apiHeader {String} Authorization   User's access token
   *
   * @apiParam  {Number{1-}}         [page=1]           List page
   * @apiParam  {Number{1-100}}      [perPage=1]        quizzes per page
   * @apiParam  {String}             [fields=id title,forCourse,questions]  Fields to be fetched
   *
   * @apiSuccess {Object[]} List of quizzes.
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .get(authorize(LOGGED_USER), validate(listQuiz), controller.my);

router
  .route("")
  /**
   * @api {POST} v1/quiz Create quiz
   * @apiDescription Create an quiz
   * @apiVersion 1.0.0
   * @apiName Createquiz
   * @apiGroup quiz
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization          User's access token
   *
   * @apiParam    title         Quiz's title
   * @apiParam    forCourse     Quiz's associated course
   * @apiParam    duration      Quiz's duration
   * @apiParam    questions     Quiz's questions
   *
   * @apiSuccess (Created 201) {String} title Quiz title
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .post(authorize([ADMIN, TRAINER]), validate(createQuiz), controller.create);

router
  .route("/:quizId")
  /**
   * @api {GET} v1/quiz/:quizId Get quiz Details
   * @apiDescription Get a quiz Details
   * @apiVersion 1.0.0
   * @apiName Fetchquiz
   * @apiGroup quiz
   * @apiPermission Logged User
   *
   * @apiHeader {String} Authorization          User's access token
   *
   * @apiParam   {String}  quizId  quiz's Id
   *
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .get(authorize(LOGGED_USER), validate(fetchQuiz), controller.fetch)
  /**
   * @api {PATCH} v1/quiz/:quizId Update quiz
   * @apiDescription Update an quiz
   * @apiVersion 1.0.0
   * @apiName Updatequiz
   * @apiGroup quiz
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization          User's access token
   *
   * @apiParam {String}  quizId                quiz's Id
   *
   *
   * @apiSuccess (No Content 204)                quiz updated
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .patch(
    authorize([ADMIN, TRAINER]),
    validate(updateQuiz),
    controller.updateOne
  )
  /**
   * @api {DELETE} v1/quiz/:quizId quiz event
   * @apiDescription DELETE a quiz
   * @apiVersion 1.0.0
   * @apiName Deletequiz
   * @apiGroup quiz
   * @apiPermission Admin
   *
   * @apiHeader {String} Authorization           User's access token
   *
   * @apiParam   {String}  quizId               quiz's Id
   *
   * @apiSuccess (No Content 204)                quiz deleted
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .delete(
    authorize([ADMIN, TRAINER]),
    validate(deleteQuiz),
    controller.removeOne
  );

module.exports = router;
