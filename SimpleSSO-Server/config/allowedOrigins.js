const hostname = require('./hostname');

const appName = "https://" + hostname.hostname + ":3000";
const ssoName = "https://" + hostname.ssoHostname;
const certAuthName = "https://" + hostname.certAuthHostname;

const allowedOrigins = {};
allowedOrigins[appName] = true;
allowedOrigins[ssoName] = true;
allowedOrigins[certAuthName] = true;

module.exports = allowedOrigins;
