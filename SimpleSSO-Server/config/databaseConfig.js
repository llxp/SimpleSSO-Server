const mongodbIp = process.env["MONGODB_PORT_27017_TCP_ADDR"];
const mongodbProtocol = 'mongodb://';
const mongodbPort = '27017';
const mongodbDatabase = 'SimpleSSOServer';

const databaseUrl = mongodbProtocol + mongodbIp + ':' + mongodbPort + '/' + mongodbDatabase;

module.exports = {
  databaseUrl:databaseUrl
};
