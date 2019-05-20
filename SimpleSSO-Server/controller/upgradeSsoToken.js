const fromAuthHeaderAsBearerToken = require("./fromAuthHeaderAsBearerToken");
const appTokenFromRequest = fromAuthHeaderAsBearerToken();
const applicationCache = require("./applicationCache");
const generatePayload = require("./generatePayload");
const config = require("../config");
const { genJwtToken } = require("./jwt_helper");

const upgradeSsoToken = async (req, res, next) => {
  try {
    const { ssoToken, client_secret } = req.query;
    //const appToken = appTokenFromRequest(req);
    // if the application token is not present or ssoToken request is invalid
    // if the ssoToken is not present in the cache some is
    // smart.
    applicationCache.intrmTokenCache.get(ssoToken, (obj) => {
      if (client_secret == null ||
        //appToken == null ||
        ssoToken == null ||
        obj == null) {
          return res.status(400).json({ message: "badRequest" });
      }

      // if the appToken is present and check if it's valid for the application
      const appName = obj[1];
      const globalSessionToken = obj[0];
      console.log(obj, globalSessionToken);

      applicationCache.sessionApp.get(globalSessionToken, (sessionAppObj) => {
        console.log("SESSIONAPPOBJ!!!");
        console.log(sessionAppObj);
        console.log(appName);
        console.log(sessionAppObj[appName]);
        console.log(client_secret);
        console.log(config.appTokenDB[appName]);
        if (client_secret !== config.appTokenDB[appName] ||
          //appToken !== config.appTokenDB[appName] ||
          sessionAppObj[appName] !== true) {
          return res.status(403).json({ message: "Unauthorized" });
        }
        // checking if the token passed has been generated
        generatePayload(ssoToken, async (payload) => {
          console.log("payload!");
          console.log(payload);
          if(payload != null) {
            const token = await genJwtToken(payload);
            const origin = req.get('origin');
            applicationCache.storeBearerTokenInCache(origin, globalSessionToken, token);
            // delete the itremCache key for no futher use,
            applicationCache.intrmTokenCache.delete(ssoToken);
            return res.status(200).json({ token });
          } else {
            return res.status(403).json({ message: "Unauthorized" });
          }
        });
      });
    });
  } catch(error) {
    console.log("EXCEPTION!!!");
    console.log(error);
    return res.status(403).json({ message: "Unauthorized" });
  }
};

module.exports = upgradeSsoToken;
