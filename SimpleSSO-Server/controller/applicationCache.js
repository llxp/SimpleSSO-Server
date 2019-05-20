const config = require("../config");
var MongoClient = require('mongodb').MongoClient;

// A temporary cache to store all the application that has login using the current session.
// It can be useful for variuos audit purpose
//const sessionUser = {};
//const sessionApp = {};

// these token are for the validation purpose
//const intrmTokenCache = {};

//var validTokens = [];

var dbObject = {};

const initDatabase = (callback) => {
    MongoClient.connect("mongodb://localhost:27017/SimpleSSOServer", function (err, db) {
      if(err) throw err;
      dbObject = db;
      callback(db);
    });
};

const fillIntrmTokenCache = (origin, id, intrmToken) => {
  //intrmTokenCache[intrmToken] = [id, config.originAppNames[origin]];
  setIntrmTokenCache(intrmToken, [id, config.originAppNames[origin]]);
};
const storeApplicationInCache = (origin, id, intrmToken) => {
  //console.log("origin, id, intrmToken: " + origin +" " + id + " " + intrmToken);
  getSessionApp(id, (obj) => {
    if(typeof obj === typeof undefined ||
       obj == null) {
      setSessionApp(id, {
        [config.originAppNames[origin]]: true
      });
      fillIntrmTokenCache(origin, id, intrmToken);
    } else {
        var objCopy = obj;
        objCopy[config.originAppNames[origin]] = true;
        setSessionApp(id, objCopy);
        fillIntrmTokenCache(origin, id, intrmToken);
    }
  });
  //console.log({ ...sessionApp }, { ...sessionUser }, { intrmTokenCache });
};

const fillValidTokenCache = (origin, id, bearerToken) => {
  setValidTokens(bearerToken, [id, config.originAppNames[origin]]);
};
const storeBearerTokenInCache = (origin, id, bearerToken) => {
  getSessionApp(id, (obj) => {
    if(typeof obj === typeof undefined ||
       obj == null) {
      setSessionApp(id, {
        [config.originAppNames[origin]]: true
      });
      fillValidTokenCache(origin, id, bearerToken);
    } else {
      var objCopy = obj;
      objCopy[config.originAppNames[origin]] = true;
      setSessionApp(id, objCopy);
      fillValidTokenCache(origin, id, bearerToken);
    }
  });
};

const getIntrmTokenCache = (token, callback) => {
  initDatabase((db) => {
    db.collection('IntrmTokenCache', async function(err, collection) {
      if(err) throw err;
      const obj = await collection.findOne({tokenId: token});
      if(obj !== null) {
        callback(obj.data);
      } else {
        callback(null);
      }
    });
  });
};

const setIntrmTokenCache = (token, obj) => {
  initDatabase((db)=> {
    db.collection('IntrmTokenCache', async function(err, collection) {
      const oldObj = await collection.findOne({tokenId: token});
      if(oldObj) {
        await collection.replaceOne({tokenId: token}, {tokenId: token, data: obj});
      } else {
        await collection.insertOne({tokenId: token, data: obj});
      }
    });
  });
}

const deleteIntrmTokenCache = (token) => {
  initDatabase((db)=> {
    db.collection('IntrmTokenCache', async function(err, collection) {
      if(err) throw err;
      await collection.deleteOne({tokenId: token});
    });
  });
};

const getSessionApp = (id, callback) => {
  initDatabase((db) => {
    db.collection('SessionApp', async function(err, collection) {
      if(err) throw err;
      const obj = await collection.findOne({sessionId: id});
      if(obj !== null) {
        callback(obj.data);
      } else {
        callback(null);
      }
    });
  });
};

const setSessionApp = (id, obj) => {
  initDatabase((db)=> {
    db.collection('SessionApp', async function(err, collection) {
      const oldObj = await collection.findOne({sessionId: id});
      if(oldObj) {
        await collection.replaceOne({sessionId: id}, {sessionId: id, data: obj});
      } else {
        await collection.insertOne({sessionId: id, data: obj});
      }
    });
  });
};

const deleteSessionApp = (id) => {
  initDatabase((db)=> {
    db.collection('SessionApp', async function(err, collection) {
      if(err) throw err;
      await collection.deleteOne({sessionId: id});
    });
  });
};

const getSessionUser = (id, callback) => {
  initDatabase((db)=> {
    db.collection('SessionUser', async function(err, collection) {
      if(err) throw err;
      const obj = await collection.findOne({sessionId: id});
      if(obj !== null) {
        callback(obj.data);
      } else {
        callback(null);
      }
    });
  });
};

const setSessionUser = (id, obj) => {
  initDatabase((db) => {
    db.collection('SessionUser', async function(err, collection) {
      const oldObj = await collection.findOne({sessionId: id});
      if(oldObj) {
        await collection.replaceOne({sessionId: id}, {sessionId: id, data: obj});
      } else {
        await collection.insertOne({sessionId: id, data: obj});
      }
    });
  });
};

const deleteSessionUser = (id) => {
  initDatabase((db) => {
    db.collection('SessionUser', async function(err, collection) {
      if(err) throw err;
      await collection.deleteOne({sessionId: id});
    });
  });
};

const getValidTokens = (id, callback) => {
  initDatabase((db) => {
    db.collection('ValidTokens', async function(err, collection) {
      if(err) throw err;
      const obj = await collection.findOne({sessionId: id});
      if(obj !== null) {
        callback(obj.data);
      } else {
        callback(null);
      }
    });
  });
};

const setValidTokens = (id, obj) => {
  initDatabase((db) => {
    db.collection('ValidTokens', async function(err, collection) {
      const oldObj = await collection.findOne({sessionId: id});
      if(oldObj) {
        await collection.replaceOne({sessionId: id}, {sessionId: id, data: obj});
      } else {
        await collection.insertOne({sessionId: id, data: obj});
      }
    });
  });
};

const deleteValidTokens = (id) => {
  initDatabase((db) => {
    db.collection('ValidTokens', async function(err, collection) {
      if(err) throw err;
      await collection.deleteOne({sessionId: id});
    });
  });
};


module.exports = {
  sessionUser: {
    get: getSessionUser,
    set: setSessionUser,
    delete: deleteSessionUser
  },
  sessionApp: {
    get: getSessionApp,
    set: setSessionApp,
    delete: deleteSessionApp
  },
  intrmTokenCache: {
    get: getIntrmTokenCache,
    set: setIntrmTokenCache,
    delete: deleteIntrmTokenCache
  },
  storeApplicationInCache: storeApplicationInCache,
  validTokens: {
    get: getValidTokens,
    set: setValidTokens,
    delete: deleteValidTokens
  },
  storeBearerTokenInCache: storeBearerTokenInCache
};
