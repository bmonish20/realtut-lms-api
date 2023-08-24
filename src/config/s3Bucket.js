var AWS = require("aws-sdk");
const includes = require("lodash/includes");
var { bucketName, userAccessKey, userSecret } = require("../config/vars").s3;
const {
  RESUME_BUCKET_TYPE,
  PROFILE_BUCKET_TYPE,
} = require("../api/utils/constants");

const s3bucket = new AWS.S3({
  accessKeyId: userAccessKey,
  secretAccessKey: userSecret,
  region: "ap-south-1",
  signatureVersion: "v4",
});

const GetBucketPath = (path) => {
  switch (path) {
    case PROFILE_BUCKET_TYPE:
      return "profile/";
    case RESUME_BUCKET_TYPE:
      return "resume/";
    default:
      return `${path}/`;
  }
};

exports.GetPreSignedUrl = async (email, path) => {
  const bucketPath = GetBucketPath(path);
  var params = {
    Bucket: bucketName,
    Key: bucketPath + email,
  };

  var paramSettings = {
    ResponseContentDisposition: "inline",
    Expires: 60 * 60 * 24 * 7,
  };

  try {
    var headCode = await s3bucket.headObject(params).promise();

    var url = await s3bucket.getSignedUrl("getObject", {
      ...params,
      ...paramSettings,
    });
    return url;
  } catch (headError) {
    if (headError.code == "NotFound") {
      throw new Error(`${path} not found`);
    }
  }
};

const resumeMimes = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/svg+xml",
  "video/mp4",
  "video/mpeg",
  "video/ogg",
  "video/quicktime",
  "video/webm",
  "video/x-m4v",
  "video/ms-asf",
  "video/x-ms-wmv",
  "video/x-msvideo",
  "application/pdf",
  "application/msword",
  "text/html",
  "application/vnd.openxmlformats-officedocument.wordprocessingm",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const validateMimeType = (file, path) => {
  if (path === PROFILE_BUCKET_TYPE) return file.mimetype.indexOf("image/") > -1;
  else if (path === RESUME_BUCKET_TYPE) {
    return resumeMimes.includes(file.mimetype);
  }
  return true;
};

exports.DeleteFile = async (key, path) => {
  console.log("S3 Delete", { key, path });
  const bucketPath = GetBucketPath(path);

  if (bucketPath == "") {
    throw new Error("Invalid bucket path");
  }

  const params = {
    Bucket: bucketName,
    Key: bucketPath + key,
  };

  await s3bucket.deleteObject(params).promise();
};
exports.UploadFile = async (email, file, path) => {
  try {
    console.log({ file });
    const bucketPath = GetBucketPath(path);
    if (bucketPath == "") {
      throw new Error("Invalid bucket path");
    }

    if (!validateMimeType(file, path)) {
      throw new Error("Invalid file type");
    }

    const params = {
      Bucket: bucketName,
      Key: bucketPath + email,
      Body: file.buffer,
      ContentEncoding: file.encoding,
      ContentType: file.mimetype,
    };
    await s3bucket.upload(params).promise();
    var url = await this.GetPreSignedUrl(email, path);
    return url;
  } catch (error) {
    console.log("Error occured while uploading a file", error);
    throw error;
  }
};

exports.CreateBucket = async (bucketName) => {
  let params = {
    Bucket: bucketName,
    CreateBucketConfiguration: {
      LocationConstraint: "ap-south-1",
    },
  };
  s3bucket.createBucket(params, function (err) {
    if (err) console.log(err, err.stack);
    else console.log("Bucket created", data.location);
  });
};
