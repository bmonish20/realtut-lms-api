/**
 *
 * QuizResponses
 *
 */

const express = require("express");
const validate = require("express-validation");
const controller = require("../../controllers/quizResponses.controller");
const {
  authorize,
  LOGGED_USER,
  ADMIN,
  TRAINER,
} = require("../../middlewares/auth");
const {
  listQuizResponses,
  createQuizResponses,
  fetchQuizResponses,
  updateQuizResponses,
  deleteQuizResponses,
} = require("../../validations/quizResponses.validation");

const router = express.Router();

router
  .route("/all")
  /**
   * @api {GET} v1/quizResponses/all List quizResponses
   * @apiDescription Get a list of quizResponses
   * @apiVersion 1.0.0
   * @apiName ListquizResponses
   * @apiGroup quizResponses
   * @apiPermission logged user
   *
   * @apiHeader {String} Authorization   User's access token
   *
   * @apiParam  {Number{1-}}         [page=1]           List page
   * @apiParam  {Number{1-100}}      [perPage=1]        quizResponsess per page
   * @apiParam  {String}             [fields=id title]  Fields to be fetched
   *
   * @apiSuccess {Object[]} List of quizResponsess.
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .get(authorize(LOGGED_USER), validate(listQuizResponses), controller.list);

router
  .route("/quiz")
  /**
   * @api {GET} v1/quizResponses/my List my quizzes
   * @apiDescription Get a list of Responses
   * @apiVersion 1.0.0
   * @apiName ListQuizResponse
   * @apiGroup quizResponses
   * @apiPermission logged user
   *
   * @apiHeader {String} Authorization   User's access token
   *
   * @apiParam  {Number{1-}}         [page=1]           List page
   * @apiParam  {Number{1-100}}      [perPage=1]        quizzes per page
   * @apiParam  {String}             [fields=id,attendedBy,createdBy,response]  Fields to be fetched
   *
   * @apiSuccess {Object[]} List of Responses.
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .get(
    authorize([ADMIN, TRAINER]),
    validate(listQuizResponses),
    controller.list
  );
router
  .route("")
  /**
   * @api {POST} v1/quizResponses Create quizResponses
   * @apiDescription Create an quizResponses
   * @apiVersion 1.0.0
   * @apiName CreatequizResponses
   * @apiGroup quizResponses
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization          User's access token
   *
   * @apiParam    quizId    quizResponse's ID
   * @apiParam    createdBy    quizResponse's creator
   * @apiParam    response    quizResponse's answers
   *
   * @apiSuccess (Created 201) {String} attendedBy  quizResponse  attendedBy
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .post(
    authorize(LOGGED_USER),
    validate(createQuizResponses),
    controller.create
  );

router
  .route("/:quizResponsesId")
  /**
   * @api {GET} v1/quizResponses/:quizResponsesId Get quizResponses Details
   * @apiDescription Get a quizResponses Details
   * @apiVersion 1.0.0
   * @apiName FetchquizResponses
   * @apiGroup quizResponses
   * @apiPermission Logged User
   *
   * @apiHeader {String} Authorization          User's access token
   *
   * @apiParam   {String}  quizResponsesId  quizResponses's Id
   *
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .get(authorize(LOGGED_USER), validate(fetchQuizResponses), controller.fetch)
  /**
   * @api {PATCH} v1/quizResponses/:quizResponsesId Update quizResponses
   * @apiDescription Update an quizResponses
   * @apiVersion 1.0.0
   * @apiName UpdatequizResponses
   * @apiGroup quizResponses
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization          User's access token
   *
   * @apiParam {String}  quizResponsesId                quizResponses's Id
   *
   *
   * @apiSuccess (No Content 204)                quizResponses updated
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .patch(
    authorize([ADMIN, TRAINER]),
    validate(updateQuizResponses),
    controller.updateOne
  )
  /**
   * @api {DELETE} v1/quizResponses/:quizResponsesId quizResponses event
   * @apiDescription DELETE a quizResponses
   * @apiVersion 1.0.0
   * @apiName DeletequizResponses
   * @apiGroup quizResponses
   * @apiPermission Admin
   *
   * @apiHeader {String} Authorization           User's access token
   *
   * @apiParam   {String}  quizResponsesId               quizResponses's Id
   *
   * @apiSuccess (No Content 204)                quizResponses deleted
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .delete(
    authorize([ADMIN, TRAINER]),
    validate(deleteQuizResponses),
    controller.removeOne
  );

module.exports = router;
