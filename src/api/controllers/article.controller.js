/**
 *
 * Article
 *
 */

const httpStatus = require("http-status");
const Article = require("../models/article.model");
const ArticleInteraction = require("../models/articleInteration.model");
const { createActivity } = require("../utils/activityAndNotificationHelpers");

const {
  populateAllMultimediaUrl,
  populateOneMultimediaUrl,
} = require("../utils/s3BucketHelpers");

exports.list = async (req, res, next) => {
  try {
    const articles = await Article.list({ ...req.query, userId: req.user._id });
    await populateAllMultimediaUrl(articles, "article", "id", "pictureUrl");
    res.json(articles);
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const article = new Article({
      ...req.body,
      writtenBy: req.user._id,
    });
    const savedArticle = await article.save();
    createActivity(req.user._id, "article", `Created ${savedArticle.title}`);
    res.status(httpStatus.CREATED);
    res.json(savedArticle);
  } catch (error) {
    next(error);
  }
};

exports.fetch = async (req, res, next) => {
  try {
    const { articleId } = req.params;
    const article = await Article.fetch(articleId, req.user._id);
    await populateOneMultimediaUrl(articleId, "article", article, "pictureUrl");
    res.json(article);
  } catch (error) {
    next(error);
  }
};

exports.updateOne = async (req, res, next) => {
  try {
    const { articleId } = req.params;
    await Article.updateArticle(articleId, req.body);
    createActivity(req.user._id, "article", `Updated ${req.body.title}`);
    res.status(httpStatus.NO_CONTENT);
    res.send();
  } catch (error) {
    next(error);
  }
};

exports.removeOne = async (req, res, next) => {
  try {
    const { articleId: _id } = req.params;
    const article = await Article.fetch(_id);
    await Article.deleteOne({ _id });
    createActivity(req.user._id, "article", `Deleted ${article.title}`);
    res.status(httpStatus.NO_CONTENT);
    res.send();
  } catch (error) {
    next(error);
  }
};

exports.likeArticle = async (req, res, next) => {
  try {
    const { articleId } = req.params;
    const article = await Article.fetch(articleId);
    const interaction = new ArticleInteraction({
      articleId,
      likedBy: req.user._id,
    });
    const savedInteraction = await interaction.save();
    createActivity(req.user._id, "article", `Liked ${article.title}`);
    res.status(httpStatus.CREATED);
    res.json(savedInteraction);
  } catch (error) {
    next(error);
  }
};

exports.unlikeArticle = async (req, res, next) => {
  try {
    const { articleId } = req.params;
    const article = await Article.fetch(articleId);
    await ArticleInteraction.deleteOne({ articleId, likedBy: req.user._id });
    createActivity(req.user._id, "article", `Unliked ${article.title}`);
    res.status(httpStatus.NO_CONTENT);
    res.send();
  } catch (error) {
    next(error);
  }
};

exports.listCategories = async (req, res, next) => {
  try {
    const categories = await Article.distinctCategories();
    res.json(categories);
  } catch (error) {
    next(error);
  }
};
