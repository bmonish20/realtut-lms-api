/**
 *
 * FileUpload
 *
 */

const httpStatus = require("http-status");
const s3Bucket = require("../../config/s3Bucket");

exports.getSignedUrl = async (req, res, next) => {
  try {
    var { email, path } = req.params;
    var result = await s3Bucket.GetPreSignedUrl(email, path);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

exports.createBucket = async (req, res, next) => {
  try {
    var { bucketName } = req.query;
    const result = await s3Bucket.CreateBucket(bucketName);
    res.status(httpStatus.CREATED);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

exports.uploadFile = async (req, res, next) => {
  try {
    var { email, path } = req.params;
    var { file } = req;
    var result = await s3Bucket.UploadFile(email, file, path);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

exports.deleteFile = async (req, res, next) => {
  try {
    var { email, path } = req.params;
    var result = await s3Bucket.DeleteFile(email, path);
    res.json(result);
  } catch (error) {
    next(error);
  }
};
