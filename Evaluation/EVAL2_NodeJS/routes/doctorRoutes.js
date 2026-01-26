const express = require("express");
const router = express.Router();
const authenticate = require("../middlewares/auth");
const roleAuth = require("../middlewares/roleAuth");
const {
  viewAssignedAppointments,
  updateAppointment,
  viewAssignedTickets,
  resolveTicket,
} = require("../controllers/doctorController");

// All routes require authentication and doctor role
router.use(authenticate);
router.use(roleAuth("doctor"));

router.get("/appointments", viewAssignedAppointments);
router.patch("/appointments/:appointmentId", updateAppointment);
router.get("/support-tickets", viewAssignedTickets);
router.patch("/support-tickets/:ticketId/resolve", resolveTicket);

module.exports = router;

