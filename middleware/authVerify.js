const jwt = require("jsonwebtoken");

verifyToken = (req, res, next) => {
  const token = req.headers["barrier"];

  if (!token) {
    return res.status(403).send({ message: "No token provided!" });
  }

  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Unauthorized!" });
    }
    req.user = {
      _id: decoded._id,
      isAdmin: decoded.isAdmin,
      username: decoded.username,
      name: decoded.name,
      email: decoded.email,
    };
    next();
  });
};
isAdmin = (req, res, next) => {
  if (req.user.isAdmin) {
    next();
  } else {
    res.status(403).send({ message: "Require Admin Role!" });
  }
  return;
};

const authJwt = {
  verifyToken,
  isAdmin,
};
module.exports = authJwt;
