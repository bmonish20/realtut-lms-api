/**
*
* Category
*
*/

const httpStatus = require('http-status');
const Category = require('../models/category.model');

exports.list = async (req, res, next) => {
  try {
    const categorys = await Category.list(req.query);
    res.json(categorys);
  }
  catch (error) {
    next(error);
  }
}

exports.create = async (req, res, next) => {
  try {
    const category = new Category({
      ...req.body,
    });
    const savedCategory = await category.save();
    res.status(httpStatus.CREATED);
    res.json(savedCategory);
  } catch (error) {
    next(error);
  }
}

exports.fetch = async (req, res, next) => {
  try {
    const { categoryId } = req.params;
    const category = await Category.fetch(categoryId);
    res.json(category);
  }
  catch (error) {
    next(error);
  }
}

exports.updateOne = async (req, res, next) => {
  try {
    const { categoryId } = req.params;
    await Category.updateCategory(categoryId, req.body);
    res.status(httpStatus.NO_CONTENT);
    res.send();
  }
  catch(error) {
    next(error);
  }
}

exports.removeOne = async (req, res, next) => {
  try {
    const { categoryId: _id } = req.params;
    await Category.deleteOne({ _id });
    res.status(httpStatus.NO_CONTENT);
    res.send();
  }
  catch(error) {
    next(error);
  }
}
