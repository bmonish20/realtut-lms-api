/**
*
* Article
*
*/

const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/article.controller');
const { authorize, LOGGED_USER, ADMIN, TRAINER } = require('../../middlewares/auth');
const {
  listArticle,
  createArticle,
  fetchArticle,
  updateArticle,
  deleteArticle,
  likeArticle,
  unlikeArticle
} = require('../../validations/article.validation');

const router = express.Router();

router.route('/category')
  /**
   * @api {GET} v1/article/category List article categories
   * @apiDescription Get a list of article categories
   * @apiVersion 1.0.0
   * @apiName Listarticlecategories
   * @apiGroup article
   * @apiPermission logged user
   *
   * @apiHeader {String} Authorization   User's access token
   *
   * @apiSuccess {Object[]} List of articles categories.
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .get(authorize(LOGGED_USER), controller.listCategories);

router.route('/all')
  /**
   * @api {GET} v1/article/all List article
   * @apiDescription Get a list of article
   * @apiVersion 1.0.0
   * @apiName Listarticle
   * @apiGroup article
   * @apiPermission logged user
   *
   * @apiHeader {String} Authorization   User's access token
   *
   * @apiParam  {Number{1-}}         [page=1]           List page
   * @apiParam  {Number{1-100}}      [perPage=1]        articles per page
   * @apiParam  {String}             [fields=id title]  Fields to be fetched
   *
   * @apiSuccess {Object[]} List of articles.
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .get(authorize(LOGGED_USER), validate(listArticle), controller.list);

router.route('')
  /**
   * @api {POST} v1/article Create article
   * @apiDescription Create an article
   * @apiVersion 1.0.0
   * @apiName Createarticle
   * @apiGroup article
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization          User's access token
   * 
   * @apiParams  title             Article's title
   * @apiParams  isDraft           Is article a draft
   * @apiParams  category          Article's category
   * @apiParams  description       Article's Content
   *
   * @apiSuccess (Created 201)     Article Created
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .post(authorize([ADMIN, TRAINER]), validate(createArticle), controller.create);

router.route('/:articleId')
  /**
   * @api {GET} v1/article/:articleId Get article Details
   * @apiDescription Get a article Details
   * @apiVersion 1.0.0
   * @apiName Fetcharticle
   * @apiGroup article
   * @apiPermission Logged User
   *
   * @apiHeader {String} Authorization          User's access token
   * 
   * @apiParam   {String}  articleId  article's Id
   * 
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .get(authorize(LOGGED_USER), validate(fetchArticle), controller.fetch)
  /**
   * @api {PATCH} v1/article/:articleId Update article
   * @apiDescription Update an article
   * @apiVersion 1.0.0
   * @apiName Updatearticle
   * @apiGroup article
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization          User's access token
   * 
   * @apiParam {String}  articleId                article's Id
   * 
   *
   * @apiSuccess (No Content 204)                article updated
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .patch(authorize([ADMIN, TRAINER]), validate(updateArticle), controller.updateOne)
  /**
   * @api {DELETE} v1/article/:articleId article event
   * @apiDescription DELETE a article
   * @apiVersion 1.0.0
   * @apiName Deletearticle
   * @apiGroup article
   * @apiPermission Admin
   *
   * @apiHeader  {String} Authorization          User's access token
   * 
   * @apiParam   {String}  articleId             article's Id
   * 
   * @apiSuccess (No Content 204)                article deleted
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .delete(authorize([ADMIN, TRAINER]), validate(deleteArticle), controller.removeOne);

router.route('/:articleId/like')
  /**
   * @api {POST} v1/article/:articleId/like Like a article
   * @apiDescription Like a article
   * @apiVersion 1.0.0
   * @apiName Likearticle
   * @apiGroup article
   * @apiPermission LOGGED_USER
   *
   * @apiHeader  {String} Authorization          User's access token
   * 
   * @apiParam   {String}  articleId             article's Id
   * 
   * @apiSuccess (Created 201)                   article liked
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .post(authorize(LOGGED_USER), validate(likeArticle), controller.likeArticle)
  /**
   * @api {DELETE} v1/article/:articleId/like Unlike a article
   * @apiDescription Unlike a article
   * @apiVersion 1.0.0
   * @apiName Unlikearticle
   * @apiGroup article
   * @apiPermission LOGGED_USER
   *
   * @apiHeader  {String} Authorization          User's access token
   * 
   * @apiParam   {String}  articleId             article's Id
   * 
   * @apiSuccess (No Content 204)                article liked
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .delete(authorize(LOGGED_USER), validate(unlikeArticle), controller.unlikeArticle);

module.exports = router;
