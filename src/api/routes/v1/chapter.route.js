/**
*
* Chapter
*
*/

const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/chapter.controller');
const { authorize, LOGGED_USER, ADMIN, TRAINER } = require('../../middlewares/auth');
const {
  listChapter,
  createChapter,
  fetchChapter,
  updateChapter,
  deleteChapter,
} = require('../../validations/chapter.validation');

const router = express.Router();

router.route('/all')
  /**
   * @api {GET} v1/chapter/all List chapter
   * @apiDescription Get a list of chapter
   * @apiVersion 1.0.0
   * @apiName Listchapter
   * @apiGroup chapter
   * @apiPermission logged user
   *
   * @apiHeader {String} Authorization   User's access token
   *
   * @apiParam  {Number{1-}}         [page=1]           List page
   * @apiParam  {Number{1-100}}      [perPage=1]        chapters per page
   * @apiParam  {String}             [fields=id title]  Fields to be fetched
   *
   * @apiSuccess {Object[]} List of chapters.
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .get(authorize(LOGGED_USER), validate(listChapter), controller.list);

router.route('/my')
  /**
   * @api {GET} v1/chapter/my List my chapters
   * @apiDescription Get a list of my chapters
   * @apiVersion 1.0.0
   * @apiName ListMyChapter
   * @apiGroup chapter
   * @apiPermission logged user
   *
   * @apiHeader {String} Authorization   User's access token
   *
   * @apiParam  {Number{1-}}         [page=1]           List page
   * @apiParam  {Number{1-100}}      [perPage=1]        chapters per page
   * @apiParam  {String}             [fields=id title]  Fields to be fetched
   *
   * @apiSuccess {Object[]} List of chapters.
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .get(authorize(LOGGED_USER), validate(listChapter), controller.my);

router.route('')
  /**
   * @api {POST} v1/chapter Create chapter
   * @apiDescription Create an chapter
   * @apiVersion 1.0.0
   * @apiName Createchapter
   * @apiGroup chapter
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization          User's access token
   * 
   * @apiParam  title    Chapter's title
   * @apiParam  link     Chapter's link
   *
   * @apiSuccess (Created 201) {String} title  Chapter title
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .post(authorize([ADMIN, TRAINER]), validate(createChapter), controller.create);

router.route('/:chapterId')
  /**
   * @api {GET} v1/chapter/:chapterId Get chapter Details
   * @apiDescription Get a chapter Details
   * @apiVersion 1.0.0
   * @apiName Fetchchapter
   * @apiGroup chapter
   * @apiPermission Logged User
   *
   * @apiHeader {String} Authorization          User's access token
   * 
   * @apiParam   {String}  chapterId  chapter's Id
   * 
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .get(authorize(LOGGED_USER), validate(fetchChapter), controller.fetch)
  /**
   * @api {PATCH} v1/chapter/:chapterId Update chapter
   * @apiDescription Update an chapter
   * @apiVersion 1.0.0
   * @apiName Updatechapter
   * @apiGroup chapter
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization          User's access token
   * 
   * @apiParam {String}  chapterId                chapter's Id
   * @apiParam {String}  title                    Chapter's title
   * @apiParam {String}  link                     Chapter's link
   * 
   * @apiSuccess (No Content 204)                chapter updated
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .patch(authorize([ADMIN, TRAINER]), validate(updateChapter), controller.updateOne)
  /**
   * @api {DELETE} v1/chapter/:chapterId chapter event
   * @apiDescription DELETE a chapter
   * @apiVersion 1.0.0
   * @apiName Deletechapter
   * @apiGroup chapter
   * @apiPermission Admin
   *
   * @apiHeader {String} Authorization           User's access token
   * 
   * @apiParam   {String}  chapterId               chapter's Id
   * 
   * @apiSuccess (No Content 204)                chapter deleted
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .delete(authorize([ADMIN, TRAINER]), validate(deleteChapter), controller.removeOne);

module.exports = router;
