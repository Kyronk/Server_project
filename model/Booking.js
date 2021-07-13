const mongoose = require("mongoose");

//

const BookingSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
    },
    date: {
      type: Date,
    },
    name: {
      
      type: String,
    },
    phone: {
      type: String,
    },
    address: {
      type: String,
    },
    gender: {
      type: String,
    },
    area: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Area",
    },
    status: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Booking", BookingSchema);
