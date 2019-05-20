const allowedOrigins = require("./allowedOrigins");
const appTokenDB = require("./appTokenDB");
const originAppNames = require("./originAppNames");
const userDB = require("./userDB");
const keys = require("./keys");
const hostname = require('./hostname');

module.exports = {
	allowedOrigins: allowedOrigins,
	appTokenDB: appTokenDB,
	originAppNames: originAppNames,
	userDB: userDB,
	keys: keys,
        hostname: hostname
};
