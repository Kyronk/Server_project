const mongoose = require("mongoose");

//

const BookingSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
    },
    bookingDate: {
      type: Date,
      default: Date.now(),
    },
    area: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Area",
    },
    status: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);
module.exports = mongoose.model("Booking", BookingSchema);
