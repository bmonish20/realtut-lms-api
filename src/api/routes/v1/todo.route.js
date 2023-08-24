/**
 *
 * Todo
 *
 */

const express = require("express");
const validate = require("express-validation");
const controller = require("../../controllers/todo.controller");
const {
  authorize,
  LOGGED_USER,
  ADMIN,
  TRAINER,
} = require("../../middlewares/auth");
const {
  listTodo,
  createTodo,
  fetchTodo,
  updateTodo,
  deleteTodo,
} = require("../../validations/todo.validation");

const router = express.Router();

router
  .route("/all")
  /**
   * @api {GET} v1/todo/all List todo
   * @apiDescription Get a list of todo
   * @apiVersion 1.0.0
   * @apiName Listtodo
   * @apiGroup todo
   * @apiPermission logged user
   *
   * @apiHeader {String} Authorization   User's access token
   *
   * @apiParam  {Number{1-}}         [page=1]           List page
   * @apiParam  {Number{1-100}}      [perPage=1]        todos per page
   * @apiParam  {String}             [fields=id title]  Fields to be fetched
   *
   * @apiSuccess {Object[]} List of todos.
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .get(authorize(LOGGED_USER), validate(listTodo), controller.list);

router
  .route("")
  /**
   * @api {POST} v1/todo Create todo
   * @apiDescription Create an todo
   * @apiVersion 1.0.0
   * @apiName Createtodo
   * @apiGroup todo
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization          User's access token
   *
   * @apiParam   todoName          Todo's todoName
   * @apiParam   priority          Todo's priority
   * @apiParam   dueDate           Todo's dueDate
   * @apiParam   time              Todo's time
   * @apiParam   description       Todo's description
   * @apiParam   status            Todo's status
   *
   * @apiSuccess (Created 201) {String}   todoName Todo todoName
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .post(authorize(LOGGED_USER), validate(createTodo), controller.create);

router
  .route("/:todoId")
  /**
   * @api {GET} v1/todo/:todoId Get todo Details
   * @apiDescription Get a todo Details
   * @apiVersion 1.0.0
   * @apiName Fetchtodo
   * @apiGroup todo
   * @apiPermission Logged User
   *
   * @apiHeader {String} Authorization          User's access token
   *
   * @apiParam   {String}  todoId  todo's Id
   *
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .get(authorize(LOGGED_USER), validate(fetchTodo), controller.fetch)
  /**
   * @api {PATCH} v1/todo/:todoId Update todo
   * @apiDescription Update an todo
   * @apiVersion 1.0.0
   * @apiName Updatetodo
   * @apiGroup todo
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization          User's access token
   *
   * @apiParam {String}  todoId                todo's Id
   *
   *
   * @apiSuccess (No Content 204)                todo updated
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .patch(authorize(LOGGED_USER), validate(updateTodo), controller.updateOne)
  /**
   * @api {DELETE} v1/todo/:todoId todo event
   * @apiDescription DELETE a todo
   * @apiVersion 1.0.0
   * @apiName Deletetodo
   * @apiGroup todo
   * @apiPermission Admin
   *
   * @apiHeader {String} Authorization           User's access token
   *
   * @apiParam   {String}  todoId               todo's Id
   *
   * @apiSuccess (No Content 204)                todo deleted
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .delete(authorize(LOGGED_USER), validate(deleteTodo), controller.removeOne);

module.exports = router;
