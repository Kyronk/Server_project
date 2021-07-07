const Booking = require("../model/Booking");

// create
// @router Post api/post
// @desc Create post
// @access Private
exports.create = async function (req, res) {
  const { bookingDate } = req.body;
  const { _id } = req.user;

  try {
    const newBooking = new Booking({
      customer: _id,
    });
    await newBooking.save();
    res.json({ success: true, message: "You booking success" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false, message: "Something went wrong" });
  }
};

//read
exports.getAllBooking = async function (req, res) {
  try {
    const list = await Booking.find();
    res.status(200).send({ data: list });
  } catch (error) {
    res.status(400).send({ message: "customer not found", error });
  }
};

