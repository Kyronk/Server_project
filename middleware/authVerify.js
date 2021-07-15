const jwt = require("jsonwebtoken");

verifyToken = (req, res, next) => {
  const token = req.headers["barrier"];

  if (!token) {
    return res.status(403).send({ message: "No token provided!", success: false });
  }

  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Unauthorized!", success: false });
    }
    req.user = {
      _id: decoded._id,
      isAdmin: decoded.isAdmin,
      username: decoded.username,
      name: decoded.name,
      email: decoded.email,
      expo_token: decoded.expo_token,
    };
    next();
  });
};
isAdmin = (req, res, next) => {
  if (req.user.isAdmin) {
    next();
  } else {
    res.status(403).send({ message: "Require Admin Role!", success: false });
  }
  return;
};

const authJwt = {
  verifyToken,
  isAdmin,
};
module.exports = authJwt;
