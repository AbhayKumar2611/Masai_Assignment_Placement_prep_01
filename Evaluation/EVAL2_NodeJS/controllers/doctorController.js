const Appointment = require("../models/Appointment");
const SupportTicket = require("../models/SupportTicket");
const User = require("../models/User");
const mongoose = require("mongoose");

const viewAssignedAppointments = async (req, res, next) => {
  try {
    const doctorId = req.user.userId;
    const { status } = req.query;

    const filter = { doctorId };
    if (status) {
      filter.status = status;
    }

    const appointments = await Appointment.find(filter)
      .populate("patientId", "name email")
      .populate("doctorId", "name email specialization")
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

const updateAppointment = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { appointmentId } = req.params;
    const { prescription, status } = req.body;
    const doctorId = req.user.userId;

    if (!prescription && !status) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: "Prescription or status is required",
      });
    }

    // Find appointment
    const appointment = await Appointment.findOne({
      _id: appointmentId,
      doctorId,
    }).session(session);

    if (!appointment) {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        message: "Appointment not found or you don't have permission",
      });
    }

    // Update prescription
    if (prescription) {
      appointment.prescription = prescription;
    }

    // Update status
    if (status) {
      if (!["booked", "completed", "cancelled"].includes(status)) {
        await session.abortTransaction();
        return res.status(400).json({
          success: false,
          message: "Invalid status",
        });
      }
      appointment.status = status;

      // If cancelled, add to medical history
      if (status === "cancelled") {
        const patient = await User.findById(appointment.patientId).session(
          session
        );
        if (patient) {
          patient.medicalHistory.push({
            appointmentId: appointment._id,
            diagnosis: "Cancelled",
            notes: "Appointment was cancelled",
            date: new Date(),
          });
          await patient.save({ session });
        }
      }
    }

    await appointment.save({ session });
    await session.commitTransaction();

    await appointment.populate("patientId", "name email");
    await appointment.populate("doctorId", "name email specialization");

    res.json({
      success: true,
      message: "Appointment updated successfully",
      data: appointment,
    });
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};

const viewAssignedTickets = async (req, res, next) => {
  try {
    const doctorId = req.user.userId;
    const { status, priority } = req.query;

    const filter = { assignedDoctorId: doctorId };
    if (status) {
      filter.status = status;
    }
    if (priority) {
      filter.priority = priority;
    }

    const tickets = await SupportTicket.find(filter)
      .populate("patientId", "name email")
      .populate("assignedDoctorId", "name email specialization")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      message: "Tickets retrieved successfully",
      count: tickets.length,
      data: tickets,
    });
  } catch (error) {
    next(error);
  }
};

const resolveTicket = async (req, res, next) => {
  try {
    const { ticketId } = req.params;
    const doctorId = req.user.userId;

    const ticket = await SupportTicket.findOne({
      _id: ticketId,
      assignedDoctorId: doctorId,
    });

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found or you don't have permission",
      });
    }

    if (ticket.status === "resolved") {
      return res.status(400).json({
        success: false,
        message: "Ticket is already resolved",
      });
    }

    ticket.status = "resolved";
    ticket.closedAt = new Date();

    await ticket.save();

    await ticket.populate("patientId", "name email");
    await ticket.populate("assignedDoctorId", "name email specialization");

    res.json({
      success: true,
      message: "Ticket resolved successfully",
      data: ticket,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  viewAssignedAppointments,
  updateAppointment,
  viewAssignedTickets,
  resolveTicket,
};

