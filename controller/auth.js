const Admin = require("../model/Admin");
const Customer = require("../model/Customer");
const jwt = require("jsonwebtoken");
const _ = require("lodash");

//POST api/auth/admin-login
// Login Admin
exports.adminLogin = async function (req, res) {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(500).json({ success: false, message: "Missing username or password" });
    }

    const admin = await Admin.findOne({ username, password }, { username: 1 });
    if (_.isNil(admin)) {
      return res.status(500).json({ success: false, message: "Incorrect username or password" });
    }
    const authData = {
      _id: admin._id,
      username: admin.username,
      isAdmin: true,
    };
    const token = await jwt.sign(authData, process.env.SECRET_KEY, {
      expiresIn: "30d",
    });

    res.status(200).send({ message: "login success", token });
  } catch (error) {
    res.status(400).send({ message: "exception login", error });
  }
};

//POST api/auth/customer-login
// Login Customer
exports.customerLogin = async function (req, res) {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(500).json({ success: false, message: "Missing username or password" });
    }

    const account = await Customer.findOne({ username, password }, { firstName: 1, lastName: 1, email: 1 });

    if (_.isNil(account)) {
      return res.status(500).json("incorrect username or password");
    }
    const authData = {
      _id: account._id,
      username: account.username,
      firstName: account.firstName,
      lastName: account.lastName,
      email: account.email,
    };
    const token = await jwt.sign(authData, process.env.SECRET_KEY, {
      expiresIn: "30d",
    });

    res.status(200).send({ message: "login success", token });
  } catch (error) {
    res.status(400).send({ message: "exception login", error });
  }
};
