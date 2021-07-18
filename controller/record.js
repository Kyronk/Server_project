const Record = require("../model/Record");
const Customer = require("../model/Customer");
const _ = require("lodash");
const Booking = require("../model/Booking");

exports.createRecord = async (req, res) => {
  try {
    const { _id } = req.user;
    const { profile, description, reDate, booking, areaId } = req.body;
    if (_.isEmpty(profile) || _.isEmpty(description) || _.isEmpty(reDate) || _.isEmpty(areaId)) {
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
      bookingDate: booking.date,
      area: areaId,
    });
    const result = await record.save();
    await Booking.findOneAndUpdate({ _id: booking._id }, { isActive: 1 });
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

exports.getRecordByCustomerId = (req, res) => {
  const perPage = 15;
  const page = Math.max(0, +req.query.page);

  const { id } = req.params;
  Record.find({ customer: id }, "-__v")
    .limit(perPage)
    .skip(perPage * (+page - 1))
    .populate("doctor", { name: 1 })
    .sort({ _id: -1 })

    .exec((err, record) => {
      if (err) {
        return res.status(500).send({ message: "Lỗi , vui lòng thử lại sau", success: false });
      }
      if (!record) {
        return res.status(500).send({ message: "Không tìm thấy dữ liệu", success: false });
      }
      Record.countDocuments().exec(function (err, count) {
        totalPage = 1;
        if (count / perPage > 1) {
          totalPage = Math.round(count / perPage);
        }
        return res.status(200).send({
          data: record,
          page: page,
          totalPage,
          success: true,
        });
      });
    });
};
