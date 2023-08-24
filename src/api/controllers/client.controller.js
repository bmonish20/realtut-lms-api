/**
*
* Client
*
*/

const httpStatus = require('http-status');
const Client = require('../models/client.model');

exports.list = async (req, res, next) => {
  try {
    const clients = await Client.list(req.query);
    res.json(clients);
  }
  catch (error) {
    next(error);
  }
}

exports.create = async (req, res, next) => {
  try {
    const client = new Client({
      ...req.body,
    });
    const savedClient = await client.save();
    res.status(httpStatus.CREATED);
    res.json(savedClient);
  } catch (error) {
    next(error);
  }
}

exports.fetch = async (req, res, next) => {
  try {
    const { clientId } = req.params;
    const client = await Client.fetch(clientId);
    res.json(client);
  }
  catch (error) {
    next(error);
  }
}

exports.updateOne = async (req, res, next) => {
  try {
    const { clientId } = req.params;
    await Client.updateClient(clientId, req.body);
    res.status(httpStatus.NO_CONTENT);
    res.send();
  }
  catch(error) {
    next(error);
  }
}

exports.removeOne = async (req, res, next) => {
  try {
    const { clientId: _id } = req.params;
    await Client.deleteOne({ _id });
    res.status(httpStatus.NO_CONTENT);
    res.send();
  }
  catch(error) {
    next(error);
  }
}
