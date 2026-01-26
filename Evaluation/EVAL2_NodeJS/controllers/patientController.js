const Appointment = require("../models/Appointment");
const SupportTicket = require("../models/SupportTicket");
const User = require("../models/User");
const mongoose = require("mongoose");

const bookAppointment = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { doctorId, appointmentDate, symptoms } = req.body;
    const patientId = req.user.userId;

    // Validation
    if (!doctorId || !appointmentDate || !symptoms) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: "Doctor ID, appointment date, and symptoms are required",
      });
    }

    // Check if doctor exists and is active
    const doctor = await User.findOne({
      _id: doctorId,
      role: "doctor",
      isActive: true,
    }).session(session);

    if (!doctor) {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        message: "Doctor not found or inactive",
      });
    }

    // Check for overlapping appointments
    const appointmentDateObj = new Date(appointmentDate);
    const existingAppointment = await Appointment.findOne({
      doctorId,
      appointmentDate: appointmentDateObj,
      status: { $in: ["booked", "completed"] },
    }).session(session);

    if (existingAppointment) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: "Doctor already has an appointment at this time",
      });
    }

    // Create appointment
    const appointment = new Appointment({
      patientId,
      doctorId,
      appointmentDate: appointmentDateObj,
      symptoms,
    });

    await appointment.save({ session });

    await session.commitTransaction();

    // Populate appointment details
    await appointment.populate("doctorId", "name email specialization");
    await appointment.populate("patientId", "name email");

    res.status(201).json({
      success: true,
      message: "Appointment booked successfully",
      data: appointment,
    });
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};

const viewOwnAppointments = async (req, res, next) => {
  try {
    const patientId = req.user.userId;
    const { status } = req.query;

    const filter = { patientId };
    if (status) {
      filter.status = status;
    }

    const appointments = await Appointment.find(filter)
      .populate("doctorId", "name email specialization")
      .populate("patientId", "name email")
      .sort({ appointmentDate: -1 });

    res.json({
      success: true,
      message: "Appointments retrieved successfully",
      count: appointments.length,
      data: appointments,
    });
  } catch (error) {
    next(error);
  }
};

const raiseSupportTicket = async (req, res, next) => {
  try {
    const { title, description, priority } = req.body;
    const patientId = req.user.userId;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: "Title and description are required",
      });
    }

    const ticket = new SupportTicket({
      title,
      description,
      priority: priority || "medium",
      patientId,
    });

    await ticket.save();

    await ticket.populate("patientId", "name email");

    res.status(201).json({
      success: true,
      message: "Support ticket raised successfully",
      data: ticket,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  bookAppointment,
  viewOwnAppointments,
  raiseSupportTicket,
};

