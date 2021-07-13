const mongoose = require("mongoose");

const DocumentSchema = new mongoose.Schema(
  {
    description: {
      type: String,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Document", DocumentSchema);
