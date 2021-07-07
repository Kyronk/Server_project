const mongoose = require("mongoose");

const medicalRecordSchema = new mongoose.Schema(
  {
    description: {
      type: String,
    },
    confirmationPerson: {
      type: String,
    },
    medicalRecordDocument: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MedicalRecordDocument",
    },
  },
  { timestamps: true }
);

module.mongoose = mongoose.model("MedicalRecord", medicalRecordSchema);
