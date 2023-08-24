/**
 *
 * Category
 *
 */

const express = require("express");
const validate = require("express-validation");
const controller = require("../../controllers/category.controller");
const {
  authorize,
  LOGGED_USER,
  ADMIN,
  TRAINER,
} = require("../../middlewares/auth");
const {
  listCategory,
  createCategory,
  fetchCategory,
  updateCategory,
  deleteCategory,
} = require("../../validations/category.validation");

const router = express.Router();

router
  .route("/all")
  /**
   * @api {GET} v1/category/all List category
   * @apiDescription Get a list of category
   * @apiVersion 1.0.0
   * @apiName Listcategory
   * @apiGroup category
   * @apiPermission logged user
   *
   * @apiHeader {String} Authorization   User's access token
   *
   * @apiParam  {Number{1-}}         [page=1]           List page
   * @apiParam  {Number{1-100}}      [perPage=1]        categorys per page
   * @apiParam  {String}             [fields=id title]  Fields to be fetched
   *
   * @apiSuccess {Object[]} List of categorys.
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .get(authorize(LOGGED_USER), validate(listCategory), controller.list);

router
  .route("")
  /**
   * @api {POST} v1/category Create category
   * @apiDescription Create an category
   * @apiVersion 1.0.0
   * @apiName Createcategory
   * @apiGroup category
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization          User's access token
   *
   * @apiParam {String}                     title  category's title
   *
   * @apiSuccess (Created 201) {String}  id         category's id
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .post(
    authorize([ADMIN, TRAINER]),
    validate(createCategory),
    controller.create
  );

router
  .route("/:categoryId")
  /**
   * @api {GET} v1/category/:categoryId Get category Details
   * @apiDescription Get a category Details
   * @apiVersion 1.0.0
   * @apiName Fetchcategory
   * @apiGroup category
   * @apiPermission Logged User
   *
   * @apiHeader {String} Authorization          User's access token
   *
   * @apiParam   {String}  categoryId  category's Id
   *
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .get(authorize(LOGGED_USER), validate(fetchCategory), controller.fetch)
  /**
   * @api {PATCH} v1/category/:categoryId Update category
   * @apiDescription Update an category
   * @apiVersion 1.0.0
   * @apiName Updatecategory
   * @apiGroup category
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization          User's access token
   *
   * @apiParam {String}  categoryId                category's Id
   *
   *
   * @apiSuccess (No Content 204)                category updated
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .patch(
    authorize([ADMIN, TRAINER]),
    validate(updateCategory),
    controller.updateOne
  )
  /**
   * @api {DELETE} v1/category/:categoryId category event
   * @apiDescription DELETE a category
   * @apiVersion 1.0.0
   * @apiName Deletecategory
   * @apiGroup category
   * @apiPermission Admin
   *
   * @apiHeader {String} Authorization           User's access token
   *
   * @apiParam   {String}  categoryId               category's Id
   *
   * @apiSuccess (No Content 204)                category deleted
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .delete(
    authorize([ADMIN, TRAINER]),
    validate(deleteCategory),
    controller.removeOne
  );

module.exports = router;
