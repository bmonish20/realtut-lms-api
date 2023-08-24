const express = require("express");
const validate = require("express-validation");
const controller = require("../../controllers/task.controller");
const {
  authorize,
  LOGGED_USER,
  ADMIN,
  TRAINER,
} = require("../../middlewares/auth");
const {
  listTask,
  createTask,
  fetchTask,
  updateTask,
  deleteTask,
} = require("../../validations/task.validation");

const router = express.Router();

router
  .route("/all")
  /**
   * @api {GET} v1/task/all List task
   * @apiDescription Get a list of task
   * @apiVersion 1.0.0
   * @apiName Listtask
   * @apiGroup task
   * @apiPermission logged user
   *
   * @apiHeader {String} Authorization   User's access token
   *
   * @apiParam  {Number{1-}}         [page=1]           List page
   * @apiParam  {Number{1-100}}      [perPage=1]        tasks per page
   * @apiParam  {String}             [fields=id title]  Fields to be fetched
   *
   * @apiSuccess {Object[]} List of tasks.
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only owners can access the data
   */
  .get(authorize(LOGGED_USER), validate(listTask), controller.list);

router
  .route("")
  /**
   * @api {POST} v1/task Create task
   * @apiDescription Create an task
   * @apiVersion 1.0.0
   * @apiName Createtask
   * @apiGroup task
   * @apiPermission logged user
   *
   * @apiHeader {String} Authorization          User's access token
   *
   * @apiParam   taskName          Task's taskName
   * @apiParam   priority          Task's priority
   * @apiParam   startDate         Task's startDate
   * @apiParam   dueDate           Task's dueDate
   * @apiParam   time              Task's time
   * @apiParam   description       Task's description
   * @apiParam   status            Task's status
   *
   * @apiSuccess (Created 201) {String}   taskName Task taskName
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only owners can access the data
   */
  .post(authorize(LOGGED_USER), validate(createTask), controller.create);

router
  .route("/:taskId")
  /**
   * @api {GET} v1/task/:taskId Get task Details
   * @apiDescription Get a task Details
   * @apiVersion 1.0.0
   * @apiName Fetchtask
   * @apiGroup task
   * @apiPermission Logged User
   *
   * @apiHeader {String} Authorization          User's access token
   *
   * @apiParam   {String}  taskId  task's Id
   *
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only owners can access the data
   */
  .get(authorize(LOGGED_USER), validate(fetchTask), controller.fetch)
  /**
   * @api {PATCH} v1/task/:taskId Update task
   * @apiDescription Update an task
   * @apiVersion 1.0.0
   * @apiName Updatetask
   * @apiGroup task
   * @apiPermission logged user
   *
   * @apiHeader {String} Authorization          User's access token
   *
   * @apiParam {String}  taskId                task's Id
   *
   *
   * @apiSuccess (No Content 204)                task updated
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only owners can access the data
   */
  .patch(authorize(LOGGED_USER), validate(updateTask), controller.updateOne)
  /**
   * @api {DELETE} v1/task/:taskId task event
   * @apiDescription DELETE a task
   * @apiVersion 1.0.0
   * @apiName Deletetask
   * @apiGroup task
   * @apiPermission logged user
   *
   * @apiHeader {String} Authorization           User's access token
   *
   * @apiParam   {String}  taskId               task's Id
   *
   * @apiSuccess (No Content 204)                task deleted
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only owners can access the data
   */
  .delete(authorize(LOGGED_USER), validate(deleteTask), controller.removeOne);

module.exports = router;
