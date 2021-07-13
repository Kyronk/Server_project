const mongoose = require("mongoose");

const AreaSchema = new mongoose.Schema(
  {
    areaName: {
      type: String,
    },
    description: {
      type: String,
    },
    location: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Area", AreaSchema);
