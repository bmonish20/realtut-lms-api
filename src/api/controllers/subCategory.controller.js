/**
*
* SubCategory
*
*/

const httpStatus = require('http-status');
const SubCategory = require('../models/subCategory.model');

exports.list = async (req, res, next) => {
  try {
    const subCategorys = await SubCategory.list(req.query);
    res.json(subCategorys);
  }
  catch (error) {
    next(error);
  }
}

exports.create = async (req, res, next) => {
  try {
    const subCategory = new SubCategory({
      ...req.body,
    });
    const savedSubCategory = await subCategory.save();
    res.status(httpStatus.CREATED);
    res.json(savedSubCategory);
  } catch (error) {
    next(error);
  }
}

exports.fetch = async (req, res, next) => {
  try {
    const { subCategoryId } = req.params;
    const subCategory = await SubCategory.fetch(subCategoryId);
    res.json(subCategory);
  }
  catch (error) {
    next(error);
  }
}

exports.updateOne = async (req, res, next) => {
  try {
    const { subCategoryId } = req.params;
    await SubCategory.updateSubCategory(subCategoryId, req.body);
    res.status(httpStatus.NO_CONTENT);
    res.send();
  }
  catch(error) {
    next(error);
  }
}

exports.removeOne = async (req, res, next) => {
  try {
    const { subCategoryId: _id } = req.params;
    await SubCategory.deleteOne({ _id });
    res.status(httpStatus.NO_CONTENT);
    res.send();
  }
  catch(error) {
    next(error);
  }
}
