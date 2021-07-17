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
      return res.status(500).send({ success: false, message: "Vui lòng nhập đầy đủ các trường" });
    }

    const admin = await Admin.findOne({ username, password }, { username: 1 });
    if (_.isNil(admin)) {
      return res.status(500).send({ success: false, message: "Số điện thoại hoặc mật khẩu không chính xác" });
    }
    const authData = {
      _id: admin._id,
      username: admin.username,
      isAdmin: true,
    };
    const token = await jwt.sign(authData, process.env.SECRET_KEY, {
      expiresIn: "30d",
    });

    res.status(200).send({ message: "Đăng nhập thành công", token, success: true });
  } catch (error) {
    res.status(400).send({ message: "Lỗi , vui lòng thử lại sau", error, success: false });
  }
};

//POST api/auth/customer-login
// Login Customer
exports.customerLogin = function (req, res) {
  try {
    const { data, expo_token } = req.body;
    const { username, password } = data;
    if (!username || !password) {
      return res.status(500).send({ success: false, message: "Vui lòng điền đầy đủ thông tin" });
    }

    Customer.findOne({ username, password }, async (err, account) => {
      if (err) {
        return res.status(400).send({ message: "Lỗi , vui lòng thử lại sau", success: false });
      }
      if (_.isNil(account)) {
        return res.status(500).send({ success: false, message: "Số điện thoại hoặc mật khẩu không chính xác" });
      }
      Customer.updateOne({ _id: account._id }, { expo_token }, (err) => {
        if (err) {
          console.log(err);
        }
      });

      const authData = {
        _id: account._id,
        username: account.username,
        name: account.name,
        email: account.email,
        dob: account.dob,
        gender: account.gender,
        address: account.address,
        expo_token: account.expo_token,
      };
      const token = await jwt.sign(authData, process.env.SECRET_KEY, {
        expiresIn: "30d",
      });

      return res.status(200).send({ success: true, message: "Đăng nhập thành công", token });
    });
  } catch (error) {
    return res.status(400).send({ message: "Lỗi , vui lòng thử lại sau", error, success: false });
  }
};

exports.customerLogout = function (req, res) {
  try {
    const { _id } = req.user;
    Customer.updateOne({ _id }, { expo_token: "" }, (err) => {
      if (err) {
        return res.status(400).send({ message: "Lỗi , vui lòng thử lại sau", success: false });
      }
      return res.status(200).send({ success: true, message: "Đăng xuất thành công" });
    });
  } catch (error) {
    return res.status(400).send({ message: "Lỗi , vui lòng thử lại sau", error, success: false });
  }
};
