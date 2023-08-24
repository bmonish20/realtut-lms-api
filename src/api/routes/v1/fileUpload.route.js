/**
 *
 * FileUpload
 *
 */

const express = require("express");
var multer = require("multer");
const controller = require("../../controllers/fileUpload.controller");
const { authorize, LOGGED_USER, ADMIN } = require("../../middlewares/auth");
const router = express.Router();

var storage = multer.memoryStorage({
  destination: function (req, file, callback) {
    callback(null, "");
  },
});

var upload = multer({ storage: storage }).single("file");

/**
   * @api {Post} v1/file/upload/:path/:email upload file
   * @apiDescription Upload a file to s3 bucket
   * @apiVersion 1.0.0
   * @apiName Upload File
   * @apiGroup File
   * @apiPermission Loggged user
   *
   * @apiHeader {String} Authorization User's access token
   * @apiParam {String}  path         bucket path       
   * @apiParam {String}  email        User's id
   * @apiParam {File}    File         File
   * 
   *
   * @apiSuccess (Created 201) {Json}    Upload Response     Response from S3
  
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
router
  .route("/upload/:path/:email")
  .post(authorize(LOGGED_USER), upload, controller.uploadFile);

router
  .route("/delete/:path/:email")
  .delete(authorize(LOGGED_USER), controller.deleteFile);

/**
 * @api {Get} v1/file/create/ Create bucket
 * @apiDescription Create a bucket in S3
 * @apiVersion 1.0.0
 * @apiName Create File
 * @apiGroup File
 * @apiPermission admin
 *
 * @apiHeader {String} Authorization          User's access token
 *
 *
 * @apiSuccess (Created 201) {Json}  StatusCode   Response from S3
 *
 * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
 * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
 */

router.route("/create").post(controller.createBucket);

/**
 * @api {Post} v1/file/getSingedUrl/:path/:email Retrieve file url
 * @apiDescription Retrieve a file url
 * @apiVersion 1.0.0
 * @apiName Retrieve a File
 * @apiGroup File
 * @apiPermission Logged user
 *
 * @apiHeader {String} Authorization        User's access token
 * @apiParam {String}  path                 Bucket path
 * @apiParam {String}  email                User's id
 *
 * @apiSuccess (Created 201) {Json}  signed Url   Response from S3
 *
 * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
 * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
 **/

router
  .route("/getSingedUrl/:path/:email")
  .get(authorize(LOGGED_USER), controller.getSignedUrl);

module.exports = router;
