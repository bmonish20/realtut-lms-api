const path = require('path');

// import .env variables
require('dotenv-safe').load({
  path: path.join(__dirname, '../../.env'),
  allowEmptyValues: true,
});

module.exports = {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpirationInterval: process.env.JWT_EXPIRATION_MINUTES,
  mongo: {
    uri: process.env.NODE_ENV === 'test' ? process.env.MONGO_URI_TESTS : process.env.MONGO_URI,
  },
  logs: process.env.NODE_ENV === 'production' ? 'combined' : 'dev',
  emailConfig: {
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    username: process.env.EMAIL_USERNAME,
    password: process.env.EMAIL_PASSWORD,
  },
  emailVerification: {
    codeExpiry: process.env.EMAIL_VERIFY_CODE_EXPIRY || 30
  },
  resetPasswordUrl: process.env.RESET_PASSWORD_APP_URL,
  webinar: {
    linkActivationLimit: parseInt(process.env.WEBINAR_LINK_ACTIVATION_LIMIT) || 6
  },
  s3:{
    bucketName: process.env.S3_BUCKET_NAME,
    userAccessKey: process.env.S3_IAM_USER_KEY,
    userSecret: process.env.S3_IAM_USER_SECRET
  },
  zoom: {
    baseURL: process.env.ZOOM_BASE_URL,
    userId: process.env.ZOOM_USER_ID,
    apiKey: process.env.ZOOM_API_KEY,
    apiSecret: process.env.ZOOM_API_SECRET,
    tokenExpiryInSeconds: process.env.ZOOM_TOKEN_EXPIRY_IN_SEC
  }
};
