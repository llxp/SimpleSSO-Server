const encodedId = require("../util/encodedId");
const config = require("../config");
const URL = require("url").URL;
const applicationCache = require("./applicationCache");

const login = (req, res, next) => {
  // The req.query will have the redirect url where we need to redirect after successful
  // login and with sso token.
  // This can also be used to verify the origin from where the request has came in
  // for the redirection
  const { redirect_uri } = req.query;
  // direct access will give the error inside new URL.
  if (redirect_uri != null) {
    const url = new URL(redirect_uri);
    if (config.allowedOrigins[url.origin] !== true) {
      return res
        .status(400)
        .json({ message: "Your are not allowed to access the sso-server" });
    }
  }
  if (req.session.user != null &&
      redirect_uri == null) {
      req.session.destroy();
  }
  // if global session already has the user directly redirect with the token
  if (req.session.user != null &&
      redirect_uri != null) {
    const url = new URL(redirect_uri);
    console.log("removeApplicationFromCache");
    applicationCache.removeApplicationfromCache(url.origin, req.session.user);
    req.session.destroy();
  }

  return res.redirect('/');
};

module.exports = login;
