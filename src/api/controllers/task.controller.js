const httpStatus = require("http-status");
const Task = require("../models/task.model");
const {
  createActivity,
  sendNotification,
} = require("../utils/activityAndNotificationHelpers");

const _omitBy = require("lodash/omitBy");
const { isNullorUndefined } = require("../utils/helpers");

const Category = require("../models/category.model");
const SubCategory = require("../models/subCategory.model");
const Client = require("../models/client.model");

exports.list = async (req, res, next) => {
  try {
    const { page, perPage, ...rest } = _omitBy(req.query, (each) =>
      isNullorUndefined(each)
    );
    let tasks = await Task.paginate(rest, {
      page: page || 1,
      limit: perPage || 10,
      sort: { createdAt: -1 },
    });
    res.json(tasks);
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const { category, subCategory, client } = req.body;
    await Category.saveCategory(category);
    await SubCategory.saveSubCategory(subCategory);
    await Client.saveClient(client);
    const task = new Task({
      ...req.body,
      createdBy: req.user._id,
    });
    const savedtask = await task.save();
    createActivity(req.user._id, "task", `Created ${savedtask.taskName}`);
    req.body.assignedTo.forEach((user) => {
      sendNotification(
        user,
        `You have been assigned the task - ${req.body.taskName}`,
        `Assigned by ${req.user.name}`
      );
    });
    res.status(httpStatus.CREATED);
    res.json(savedtask);
  } catch (error) {
    next(error);
  }
};

exports.fetch = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const task = await Task.fetch(taskId);
    res.json(task);
  } catch (error) {
    next(error);
  }
};

exports.updateOne = async (req, res, next) => {
  try {
    const { category, subCategory, client } = req.body;
    await Category.saveCategory(category);
    await SubCategory.saveSubCategory(subCategory);
    await Client.saveClient(client);
    const { taskId } = req.params;
    await Task.updateTask(taskId, req.body);
    createActivity(req.user._id, "task", `Updated ${req.body.taskName}`);
    res.status(httpStatus.NO_CONTENT);
    res.send();
  } catch (error) {
    next(error);
  }
};

exports.removeOne = async (req, res, next) => {
  try {
    const { taskId: _id } = req.params;
    const task = await Task.fetch(_id);
    createActivity(req.user._id, "task", `Deleted ${task.taskName}`);
    await Task.deleteOne({ _id });
    res.status(httpStatus.NO_CONTENT);
    res.send();
  } catch (error) {
    next(error);
  }
};
