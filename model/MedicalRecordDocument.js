const mongoose = require("mongoose");

const MedicalRecordDocumentSchema = new mongoose.Schema(
  {
    medicalRecords: [
      { type: mongoose.Schema.Types.ObjectId, ref: "MedicalRecord" },
    ],
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

module.mongoose = mongoose.model(
  "MedicalRecordDocument",
  MedicalRecordDocumentSchema
);
