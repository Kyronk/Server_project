const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema(
  {
    username: {
      type: String,
    },
    password: {
      type: String,
      required: true,
      min: 8,
      max: 1024,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Admin", AdminSchema);
