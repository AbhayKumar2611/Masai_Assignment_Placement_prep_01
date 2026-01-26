const mongoose = require("mongoose");

const medicalHistorySchema = new mongoose.Schema({
  appointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Appointment",
  },
  diagnosis: {
    type: String,
  },
  notes: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["patient", "doctor", "admin"],
      required: true,
    },
    specialization: {
      type: String,
      required: function () {
        return this.role === "doctor";
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    medicalHistory: [medicalHistorySchema],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);

