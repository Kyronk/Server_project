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
    name: {
      type: String,
    },
    gender: {
      type: String,
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
  },
  { timestamps: true }
);
module.exports = mongoose.model("Customer", CustomerSchema);
