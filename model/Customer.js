const mongoose = require("mongoose");

const CustomerSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      min: 10,
      max: 10,
    },
    password: {
      type: String,
      required: true,
      min: 8,
      max: 1024,
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    gender: {
      type: Boolean,
    },
    dob: {
      type: Date,
    },
    avatar: {
      type: String,
    },
    address: {
      type: String,
    },
    description: {
      type: String,
    },
    email: {
      type: String,
    },
    medicalRecordDocument: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MedicalRecordDocument",
    },
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Customer", CustomerSchema);
