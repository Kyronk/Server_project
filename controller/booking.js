const Booking = require("../model/Booking");

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
