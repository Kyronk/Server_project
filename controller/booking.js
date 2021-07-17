const Booking = require("../model/Booking");
const { dateformat, notification } = require("../utils/index");

const { sendPushNotification } = require("../services/pushNotification");

// create
// @router Post api/post
// @desc Create post
// @access Private
exports.create = async function (req, res) {
  const { date, name, phone, address, gender } = req.body;
  const { _id } = req.user;

  try {
    const newBooking = new Booking({
      customer: _id,
      date,
      name,
      phone,
      address,
      gender,
    });
    await newBooking.save();
    return res.status(200).send({ success: true, message: "Lịch khám của bạn đang chờ duyệt" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false, message: "Lỗi, vui lòng thử lại sau" });
  }
};

//read
exports.getHistoryBooking = async function (req, res) {
  const { _id } = req.user;

  Booking.find({ customer: _id }, "-__v")
    .sort({ _id: -1 })
    .exec((err, booking) => {
      if (err) {
        return res.status(500).send({ message: "Lỗi , vui lòng thử lại sau", success: false });
      }

      if (!booking) {
        return res.status(500).send({ message: "Không tìm thấy dữ liệu", success: false });
      }
      return res.status(200).send({ message: "Truy vấn thành công", success: true, data: booking });
    });
};

//update
exports.updateBooking = async function (req, res) {
  try {
    const { bookingId, status } = req.body;
    const filter = { _id: bookingId };
    const update = { status: status };
    const booking = await Booking.findOne(filter).populate("customer", { expo_token: 1 });
    if (!booking) {
      return res.status(500).send({ message: "Không tìm thấy dữ liệu", success: false });
    }
    const updateBooking = Booking.findOneAndUpdate(filter, update, { new: true });

    const result = booking;
    result.status = status;
    let message = "";
    if (status == 1) {
      message = `Xin chào ${booking.name} , lịch khám lúc ${dateformat(booking.date)} đã được tiếp nhận`;
    }
    if (status == 2) {
      message = `Xin chào ${booking.name} , lịch khám lúc ${dateformat(booking.date)} đã không được tiếp nhận`;
    }
    await sendPushNotification(booking.customer.expo_token, message, result);
    return res.send({ success: true, message: "Cập nhập thành công" });
  } catch (error) {
    return res.status(400).send({ message: "Lỗi , vui lòng thử lại sau", error, success: false });
  }
};
