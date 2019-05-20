const hostname = require('./hostname');

const originAppNames = {};
originAppNames['https://' + hostname.hostname + ':3000'] = 'sso_consumer';
originAppNames['https://' + hostname.ssoHostname] = 'sso_consumer';
originAppNames['https://' + hostname.certAuthHostname] = 'sso_consumer';

module.exports = originAppNames;
