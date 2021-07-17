const Customer = require("../model/Customer");

const jwt = require("jsonwebtoken");

const { genarateOTP } = require("../utils/genarateOTP");

const socketEmit = require("../index");

const _ = require("lodash");

const { sendPushNotification } = require("../services/pushNotification");

// Register Customer
exports.register = async function (req, res) {
  const { data, expo_token } = req.body;
  const { username, password, name, email, gender, dob, address, cfpwd, quest1, quest2, quest3 } = data;
  if (
    _.isNil(username) ||
    _.isNil(password) ||
    _.isNil(cfpwd) ||
    _.isNil(name) ||
    _.isNil(email) ||
    _.isNil(address) ||
    _.isNil(quest1) ||
    _.isNil(quest2) ||
    _.isNil(quest3)
  )
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
      quest3,
      quest2,
      quest1,
      expo_token,
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
        return res.status(400).send({ message: "Lỗi , vui lòng thử lại sau", success: false });
      }
      if (!customer) {
        return res.status(500).send({ message: "Không tìm thấy dữ liệu", success: false });
      }
      Customer.updateOne(filter, update, async (err) => {
        if (err) {
          return res.status(400).send({ message: "Lỗi , vui lòng thử lại sau", success: false });
        }

        const authData = {
          _id: customer._id,
          username: customer.username,
          name: _.isEmpty(name) || _.isNil(name) ? customer.name : name,
          email: _.isEmpty(email) || _.isNil(email) ? customer.email : email,
          dob: customer.dob,
          gender: customer.gender,
          address: _.isEmpty(address) || _.isNil(address) ? customer.address : address,
          expo_token: customer.expo_token,
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

exports.changePassword = (req, res) => {
  try {
    const { _id } = req.user;
    const { newPwd, oldPwd } = req.body;

    const filter = { _id };
    const update = { password: newPwd };
    Customer.findOne(filter, (err, customer) => {
      if (err) {
        return res.status(400).send({ message: "Lỗi , vui lòng thử lại sau", success: false });
      }
      if (!customer) {
        return res.status(500).send({ message: "Không tìm thấy dữ liệu", success: false });
      }
      if (oldPwd != customer.password) {
        return res.status(500).send({ message: "Mật khẩu cũ của bạn không chính xác", success: false });
      }
      if (newPwd == customer.password) {
        return res.status(500).send({ message: "Mật khẩu của bạn đang được sử dụng", success: false });
      }
      Customer.updateOne(filter, update, async (err) => {
        if (err) {
          return res.status(400).send({ message: "Lỗi , vui lòng thử lại sau", success: false });
        }

        const authData = {
          _id: customer._id,
          username: customer.username,
          name: customer.name,
          email: customer.email,
          dob: customer.dob,
          gender: customer.gender,
          address: customer.address,
          expo_token: customer.expo_token,
        };
        const token = await jwt.sign(authData, process.env.SECRET_KEY, {
          expiresIn: "30d",
        });
        return res.status(200).send({ message: "Thay đổi mật khẩu thành công", success: true, token });
      });
    });
  } catch (error) {
    return res.status(400).send({ message: "Lỗi , vui lòng thử lại sau", error, success: false });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { question, user, expo_token } = req.body;

    const filter = { username: user.phone };
    const otp = genarateOTP();
    const update = { otp: otp };
    if (user.pwd != user.cfpwd) {
      return res.status(500).send({ message: "Xác nhận mật khẩu không chính xác", success: false });
    }
    const customer = await Customer.findOne(filter, { "-__v": 0, password: 0 });
    if (!customer) {
      return res.status(500).send({ message: "Số điện thoại này chưa được đăng ký", success: false });
    }
    if (question.quest1 != customer.quest1 || question.quest2 != customer.quest2 || question.quest3 != customer.quest3) {
      return res.status(500).send({ message: "Câu trả lời không chính xác", success: false });
    }
    Customer.updateOne(filter, update, (err) => {
      if (err) {
        console.log(err);
      }
    });
    const token = await jwt.sign(customer, process.env.SECRET_KEY, {
      expiresIn: "30d",
    });
    const message = `OTP của bạn là ${otp.code} , không chia sẻ OTP này cho bất kì ai`;
    await sendPushNotification(expo_token, message, customer);
    return res.status(200).send({ message: "Đã gửi OTP", success: true, token: token });
  } catch (error) {
    return res.status(400).send({ message: "Lỗi , vui lòng thử lại sau", error, success: false });
  }
};

exports.verifyOTP = (req, res) => {
  try {
    const { _id } = req.user;
    const { otp, pwd } = req.body;
    const filter = { _id };
    Customer.findOne(filter, (err, customer) => {
      if (err) {
        return res.status(400).send({ message: "Lỗi , vui lòng thử lại sau", success: false });
      }
      if (!customer) {
        return res.status(500).send({ message: "Không tìm thấy dữ liệu", success: false });
      }
      const now = new Date();
      if (now > customer.otp.expired) {
        const update = { otp: { code: otp + "x" } };
        Customer.updateOne(filter, update, async (err) => {
          if (err) {
            return res.status(400).send({ message: "Lỗi , vui lòng thử lại sau", success: false });
          }
          return res.status(500).send({ message: "OTP đã hết hạn", success: false });
        });
      }
      if (customer.otp.code != otp) {
        return res.status(500).send({ message: "OTP không chính xác", success: false });
      }
      const update = { otp: { code: otp + "x" }, password: pwd };
      Customer.updateOne(filter, update, async (err) => {
        if (err) {
          return res.status(400).send({ message: "Lỗi , vui lòng thử lại sau", success: false });
        }

        return res.status(200).send({ message: "Đã khổi phục mật khẩu", success: true });
      });
    });
  } catch (error) {
    return res.status(400).send({ message: "Lỗi , vui lòng thử lại sau", error, success: false });
  }
};
