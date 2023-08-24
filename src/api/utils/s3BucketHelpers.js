const _get = require('lodash/get');
const s3Bucket = require('../../config/s3Bucket');

exports.populateOneMultimediaUrl = async (id, path, targetObj, fieldName) => {
  try {
    const url = await s3Bucket.GetPreSignedUrl(id, path);
    targetObj[fieldName] = url;
  }
  catch(err) {
    targetObj[fieldName] = null;
  }
}

exports.populateAllMultimediaUrl = async (
  srcObj = [],
  path,
  idField,
  targetField
) => {
  for(var i = 0; i < srcObj.length; i++) {
    const id = _get(srcObj[i], idField, null);
    if(id) {
      await this.populateOneMultimediaUrl(id, path, srcObj[i], targetField);
    }
  }
}

