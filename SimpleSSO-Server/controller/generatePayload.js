const applicationCache = require("./applicationCache");
const config = require("../config");

const generatePayload = (ssoToken, callback) => {
  applicationCache.intrmTokenCache.get(ssoToken, (obj) => {
    const globalSessionToken = obj[0];
    const appName = obj[1];
    applicationCache.sessionUser.get(globalSessionToken, (userEmail) => {
      const user = config.userDB[userEmail];
      if(typeof user != typeof undefined && user != null) {
        const appPolicy = user.appPolicy[appName];
        const email = appPolicy.shareEmail === true ? userEmail : undefined;
        const payload = {
          ...{ ...appPolicy },
          ...{
            email,
            shareEmail: undefined,
            uid: user.userId,
            // global SessionID for the logout functionality.
            globalSessionID: globalSessionToken
          }
        };
        callback(payload);
      } else {
        callback(null);
      }
    });
  });
};

module.exports = generatePayload;
