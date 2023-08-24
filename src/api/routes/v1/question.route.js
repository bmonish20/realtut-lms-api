const express = require("express");
const validate = require("express-validation");
const controller = require("../../controllers/question.controller");
const {
  authorize,
  LOGGED_USER,
  ADMIN,
  TRAINER,
} = require("../../middlewares/auth");
const {
  listQuestion,
  createQuestion,
  fetchQuestion,
  updateQuestion,
  deleteQuestion,
} = require("../../validations/question.validation");

const router = express.Router();

router
  .route("/all")
  /**
   * @api {GET} v1/question/all List question
   * @apiDescription Get a list of question
   * @apiVersion 1.0.0
   * @apiName Listquestion
   * @apiGroup question
   * @apiPermission logged user
   *
   * @apiHeader {String} Authorization   User's access token
   *
   * @apiParam  {Number{1-}}         [page=1]           List page
   * @apiParam  {Number{1-100}}      [perPage=1]        questions per page
   * @apiParam  {String}             [fields=id title]  Fields to be fetched
   *
   * @apiSuccess {Object[]} List of questions.
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .get(authorize(LOGGED_USER), validate(listQuestion), controller.list);

router
  .route("")
  /**
   * @api {POST} v1/question Create question
   * @apiDescription Create an question
   * @apiVersion 1.0.0
   * @apiName Createquestion
   * @apiGroup question
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization          User's access token
   *
   * @apiParam   question         Question's title
   * @apiParam   type             Question's type
   * @apiParam   mcqOptions       Question's mcqOptions
   * @apiParam   points           Question's points
   *
   * @apiSuccess (Created 201) {String} question Question question
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .post(
    authorize([ADMIN, TRAINER]),
    validate(createQuestion),
    controller.create
  );

router
  .route("/:questionId")
  /**
   * @api {GET} v1/question/:questionId Get question Details
   * @apiDescription Get a question Details
   * @apiVersion 1.0.0
   * @apiName Fetchquestion
   * @apiGroup question
   * @apiPermission Logged User
   *
   * @apiHeader {String} Authorization          User's access token
   *
   * @apiParam   {String}  questionId  question's Id
   *
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .get(authorize(LOGGED_USER), validate(fetchQuestion), controller.fetch)
  /**
   * @api {PATCH} v1/question/:questionId Update question
   * @apiDescription Update an question
   * @apiVersion 1.0.0
   * @apiName Updatequestion
   * @apiGroup question
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization          User's access token
   *
   * @apiParam {String}  questionId                question's Id
   *
   *
   * @apiSuccess (No Content 204)                question updated
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .patch(
    authorize([ADMIN, TRAINER]),
    validate(updateQuestion),
    controller.updateOne
  )
  /**
   * @api {DELETE} v1/question/:questionId question event
   * @apiDescription DELETE a question
   * @apiVersion 1.0.0
   * @apiName Deletequestion
   * @apiGroup question
   * @apiPermission Admin
   *
   * @apiHeader {String} Authorization           User's access token
   *
   * @apiParam   {String}  questionId               question's Id
   *
   * @apiSuccess (No Content 204)                question deleted
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .delete(
    authorize([ADMIN, TRAINER]),
    validate(deleteQuestion),
    controller.removeOne
  );

module.exports = router;
