/**
 *
 * SubCategory
 *
 */

const express = require("express");
const validate = require("express-validation");
const controller = require("../../controllers/subCategory.controller");
const {
  authorize,
  LOGGED_USER,
  ADMIN,
  TRAINER,
} = require("../../middlewares/auth");
const {
  listSubCategory,
  createSubCategory,
  fetchSubCategory,
  updateSubCategory,
  deleteSubCategory,
} = require("../../validations/subCategory.validation");

const router = express.Router();

router
  .route("/all")
  /**
   * @api {GET} v1/subCategory/all List subCategory
   * @apiDescription Get a list of subCategory
   * @apiVersion 1.0.0
   * @apiName ListsubCategory
   * @apiGroup subCategory
   * @apiPermission logged user
   *
   * @apiHeader {String} Authorization   User's access token
   *
   * @apiParam  {Number{1-}}         [page=1]           List page
   * @apiParam  {Number{1-100}}      [perPage=1]        subCategorys per page
   * @apiParam  {String}             [fields=id title]  Fields to be fetched
   *
   * @apiSuccess {Object[]} List of subCategorys.
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .get(authorize(LOGGED_USER), validate(listSubCategory), controller.list);

router
  .route("")
  /**
   * @api {POST} v1/subCategory Create subCategory
   * @apiDescription Create an subCategory
   * @apiVersion 1.0.0
   * @apiName CreatesubCategory
   * @apiGroup subCategory
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization          User's access token
   *
   * @apiParam  {String}             title             subCategory's title
   *
   * @apiSuccess (Created 201) {String}  id         subCategory's id
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .post(
    authorize([ADMIN, TRAINER]),
    validate(createSubCategory),
    controller.create
  );

router
  .route("/:subCategoryId")
  /**
   * @api {GET} v1/subCategory/:subCategoryId Get subCategory Details
   * @apiDescription Get a subCategory Details
   * @apiVersion 1.0.0
   * @apiName FetchsubCategory
   * @apiGroup subCategory
   * @apiPermission Logged User
   *
   * @apiHeader {String} Authorization          User's access token
   *
   * @apiParam   {String}  subCategoryId  subCategory's Id
   *
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .get(authorize(LOGGED_USER), validate(fetchSubCategory), controller.fetch)
  /**
   * @api {PATCH} v1/subCategory/:subCategoryId Update subCategory
   * @apiDescription Update an subCategory
   * @apiVersion 1.0.0
   * @apiName UpdatesubCategory
   * @apiGroup subCategory
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization          User's access token
   *
   * @apiParam {String}  subCategoryId                subCategory's Id
   *
   *
   * @apiSuccess (No Content 204)                subCategory updated
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .patch(
    authorize([ADMIN, TRAINER]),
    validate(updateSubCategory),
    controller.updateOne
  )
  /**
   * @api {DELETE} v1/subCategory/:subCategoryId subCategory event
   * @apiDescription DELETE a subCategory
   * @apiVersion 1.0.0
   * @apiName DeletesubCategory
   * @apiGroup subCategory
   * @apiPermission Admin
   *
   * @apiHeader {String} Authorization           User's access token
   *
   * @apiParam   {String}  subCategoryId               subCategory's Id
   *
   * @apiSuccess (No Content 204)                subCategory deleted
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .delete(
    authorize([ADMIN, TRAINER]),
    validate(deleteSubCategory),
    controller.removeOne
  );

module.exports = router;
