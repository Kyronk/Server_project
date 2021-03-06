const mongoose = require("mongoose");

const medicalRecordSchema = new mongoose.Schema(
  {
    description: {
      type: String,
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
    },
    bookingDate: {
      type: Date,
    },
    area: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Area",
    },
    reDate: {
      type: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Record", medicalRecordSchema);
