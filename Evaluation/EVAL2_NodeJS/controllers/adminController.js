const User = require("../models/User");
const Appointment = require("../models/Appointment");
const SupportTicket = require("../models/SupportTicket");
const { getCachedDoctors, cacheDoctors, clearDoctorsCache } = require("../utils/redis");

const getAllUsers = async (req, res, next) => {
  try {
    const { role, isActive } = req.query;

    const filter = {};
    if (role) {
      filter.role = role;
    }
    if (isActive !== undefined) {
      filter.isActive = isActive === "true";
    }

    const users = await User.find(filter)
      .select("-password -medicalHistory")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      message: "Users retrieved successfully",
      count: users.length,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

const getSystemStats = async (req, res, next) => {
  try {
    // Total patients
    const totalPatients = await User.countDocuments({
      role: "patient",
      isActive: true,
    });

    // Total doctors
    const totalDoctors = await User.countDocuments({
      role: "doctor",
      isActive: true,
    });

    // Appointments per doctor (aggregation)
    const appointmentsPerDoctor = await Appointment.aggregate([
      {
        $match: {
          status: { $in: ["booked", "completed"] },
        },
      },
      {
        $group: {
          _id: "$doctorId",
          appointmentCount: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "doctor",
        },
      },
      {
        $unwind: "$doctor",
      },
      {
        $project: {
          doctorId: "$_id",
          doctorName: "$doctor.name",
          doctorEmail: "$doctor.email",
          specialization: "$doctor.specialization",
          appointmentCount: 1,
          _id: 0,
        },
      },
      {
        $sort: { appointmentCount: -1 },
      },
    ]);

    // Tickets by priority (aggregation)
    const ticketsByPriority = await SupportTicket.aggregate([
      {
        $group: {
          _id: "$priority",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          priority: "$_id",
          count: 1,
          _id: 0,
        },
      },
      {
        $sort: { priority: 1 },
      },
    ]);

    // Monthly appointment stats (aggregation)
    const monthlyAppointmentStats = await Appointment.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$appointmentDate" },
            month: { $month: "$appointmentDate" },
          },
          totalAppointments: { $sum: 1 },
          booked: {
            $sum: { $cond: [{ $eq: ["$status", "booked"] }, 1, 0] },
          },
          completed: {
            $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] },
          },
          cancelled: {
            $sum: { $cond: [{ $eq: ["$status", "cancelled"] }, 1, 0] },
          },
        },
      },
      {
        $project: {
          month: {
            $concat: [
              { $toString: "$_id.year" },
              "-",
              {
                $cond: [
                  { $lt: ["$_id.month", 10] },
                  { $concat: ["0", { $toString: "$_id.month" }] },
                  { $toString: "$_id.month" },
                ],
              },
            ],
          },
          totalAppointments: 1,
          booked: 1,
          completed: 1,
          cancelled: 1,
          _id: 0,
        },
      },
      {
        $sort: { month: -1 },
      },
      {
        $limit: 12, // Last 12 months
      },
    ]);

    res.json({
      success: true,
      message: "System statistics retrieved successfully",
      data: {
        totalPatients,
        totalDoctors,
        appointmentsPerDoctor,
        ticketsByPriority,
        monthlyAppointmentStats,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getDoctorsList = async (req, res, next) => {
  try {
    // Try to get from cache
    let doctors = await getCachedDoctors();

    if (!doctors) {
      // If not in cache, fetch from database
      doctors = await User.find({
        role: "doctor",
        isActive: true,
      })
        .select("name email specialization createdAt")
        .sort({ name: 1 });

      // Cache the result
      await cacheDoctors(doctors);
    }

    res.json({
      success: true,
      message: "Doctors list retrieved successfully",
      count: doctors.length,
      data: doctors,
      cached: doctors !== null && (await getCachedDoctors()) !== null,
    });
  } catch (error) {
    next(error);
  }
};

const softDeleteUser = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.isActive = false;
    await user.save();

    // Clear doctors cache if a doctor was deleted
    if (user.role === "doctor") {
      await clearDoctorsCache();
    }

    res.json({
      success: true,
      message: "User deactivated successfully",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    next(error);
  }
};

const assignTicketToDoctor = async (req, res, next) => {
  try {
    const { ticketId } = req.params;
    const { doctorId } = req.body;

    if (!doctorId) {
      return res.status(400).json({
        success: false,
        message: "Doctor ID is required",
      });
    }

    // Check if doctor exists and is active
    const doctor = await User.findOne({
      _id: doctorId,
      role: "doctor",
      isActive: true,
    });

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found or inactive",
      });
    }

    // Find ticket
    const ticket = await SupportTicket.findById(ticketId);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found",
      });
    }

    if (ticket.status === "resolved") {
      return res.status(400).json({
        success: false,
        message: "Cannot assign a resolved ticket",
      });
    }

    ticket.assignedDoctorId = doctorId;
    ticket.status = "in-progress";
    await ticket.save();

    await ticket.populate("patientId", "name email");
    await ticket.populate("assignedDoctorId", "name email specialization");

    res.json({
      success: true,
      message: "Ticket assigned to doctor successfully",
      data: ticket,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllUsers,
  getSystemStats,
  getDoctorsList,
  softDeleteUser,
  assignTicketToDoctor,
};

