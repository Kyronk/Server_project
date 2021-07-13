const Record = require("../model/Record");
const Customer = require("../model/Customer");
const _ = require("lodash");

exports.createRecord = async (req, res) => {
  try {
    const { _id } = req.user;
    const { profile, description, reDate, booking } = req.body;
    if (_.isEmpty(profile) || _.isEmpty(description) || _.isEmpty(reDate)) {
      return res.status(400).send({ message: "Vui lòng nhập đầy đủ thông tin", success: false });
    }
    let profileId = profile._id;
    if (_.isNil(booking) || _.isEmpty(booking)) {
      profile.password = "123456";
      const customer = new Customer(profile);
      const saveCus = await customer.save();
      if (!_.isEmpty(saveCus) && !_.isNil(saveCus)) {
        profileId = saveCus._id;
      }
    }

    const record = new Record({
      description: description,
      doctor: _id,
      customer: profileId,
      reDate: reDate,
      bookingDate: booking.date || new Date(),
    });
    const result = await record.save();
    console.log(result);
    if (!_.isEmpty(result) && !_.isNil(result)) {
      return res.status(200).send({ message: "Quá trình khám kết thúc", success: true });
    }
  } catch (error) {
    return res.status(400).send({ message: "Lỗi , vui lòng thử lại sau", success: false, error });
  }
};

exports.getRecordByCustomer = (req, res) => {
  const { _id } = req.user;
  Record.find({ customer: _id }, "-__v")
    .populate("doctor", { name: 1 })
    .sort({ _id: -1 })

    .exec((err, record) => {
      if (err) {
        return res.status(500).send({ message: "Lỗi , vui lòng thử lại sau", success: false });
      }
      if (!record) {
        return res.status(500).send({ message: "Không tìm thấy dữ liệu", success: false });
      }
      return res.status(200).send({ message: "Truy vấn thành công", success: true, data: record });
    });
};
