const Customer = require("../model/Customer");

const jwt = require("jsonwebtoken");

const _ = require("lodash");
// Register Customer
exports.register = async function (req, res) {
  const { username, password, name, email, gender, dob, address, cfpwd } = req.body;
  if (_.isNil(username) || _.isNil(password) || _.isNil(cfpwd) || _.isNil(name) || _.isNil(email) || _.isNil(address))
    return res.status(500).send({ success: false, message: "Vui lòng điền đầy đủ tất cả thông tin" });

  try {
    const user = await Customer.findOne({ username });
    if (!_.isNil(user) || !_.isEmpty(user)) {
      return res.status(500).send({ success: false, message: "Số điện thoại đã được đăng ký" });
    }
    const newUser = new Customer({
      username,
      password,
      name,
      email,
      gender,
      address,
      dob,
    });
    const result = await newUser.save();
    if (result) {
      return res.status(200).send({
        success: true,
        message: "Đăng ký thành công",
      });
    }
  } catch (error) {
    return res.status(400).send({ message: "Lỗi , vui lòng thử lại sau", error, success: false });
  }
};

// Get Customer
// exports.getAllCustomer = async (req, res) => {
//   try {
//     const list = await Customer.find();
//     res.status(200).send({ data: list });
//   } catch (error) {
//     res.status(400).send({ message: "customer not found", error });
//   }
// };

exports.updateProfile = (req, res) => {
  try {
    const { _id } = req.user;
    const { name, address, email } = req.body;
    const filter = { _id };
    const update = { name, address, email };
    Customer.findOne(filter, (err, customer) => {
      if (err) {
        return res.status(400).send({ message: "Lỗi , vui lòng thử lại sau", error, success: false });
      }
      if (!customer) {
        return res.status(500).send({ message: "Không tìm thấy dữ liệu", error, success: false });
      }
      Customer.updateOne(filter, update, async (err) => {
        if (err) {
          return res.status(400).send({ message: "Lỗi , vui lòng thử lại sau", error, success: false });
        }

        const authData = {
          _id: customer._id,
          username: customer.username,
          name: _.isEmpty(name) || _.isNil(name) ? customer.name : name,
          email: _.isEmpty(email) || _.isNil(email) ? customer.email : email,
          dob: customer.dob,
          gender: customer.gender,
          address: _.isEmpty(address) || _.isNil(address) ? customer.address : address,
        };
        const token = await jwt.sign(authData, process.env.SECRET_KEY, {
          expiresIn: "30d",
        });
        return res.status(200).send({ message: "Cập nhập thành công", success: true, token });
      });
    });
  } catch (error) {
    return res.status(400).send({ message: "Lỗi , vui lòng thử lại sau", error, success: false });
  }
};
