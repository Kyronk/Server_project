const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {
  const token = req.header("Barrier");
  if (!token) {
    return res.status(401).send({ message: "Access Denied" });
  }
  try {
    const verified = jwt.verify(token, process.env.SECRET_KEY);
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).send({ message: "Invalid Token !!!" });
  }
};