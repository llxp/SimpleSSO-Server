const hostname = 'udacity-postgresql-test.northeurope.cloudapp.azure.com';
const ssoHostname = hostname + ':3001';
const certAuthHostname = hostname + ':3002';

module.exports = {
    hostname: hostname,
    ssoHostname: ssoHostname,
    certAuthHostname: certAuthHostname
};
