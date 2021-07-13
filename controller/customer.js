const Customer = require("../model/Customer");
const Document = require("../model/Document");
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
