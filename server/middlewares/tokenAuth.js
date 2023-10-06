const jwt = require("jsonwebtoken");

const tokenAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.AUTH_SECRET_KEY, (err, data) => {
      if (err) {
        //The HTTP 403 Forbidden response status code indicates that the server understands the request but refuses to authorize it.
        return res.sendStatus(403);
      } else {
        //data.user has only id field.
        req.user = data.user; 
        next();
      }
    });
  } else {
    /*The HyperText Transfer Protocol (HTTP) 401 Unauthorized response status code indicates 
      that the client request has not been completed because it lacks valid authentication credentials for the requested resource. */
    res.sendStatus(401);
  }
};

module.exports = tokenAuth;
