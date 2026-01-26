const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    appointmentDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["booked", "completed", "cancelled"],
      default: "booked",
    },
    symptoms: {
      type: String,
      required: true,
    },
    prescription: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// Index to prevent overlapping appointments for the same doctor
appointmentSchema.index({ doctorId: 1, appointmentDate: 1, status: 1 });

module.exports = mongoose.model("Appointment", appointmentSchema);

