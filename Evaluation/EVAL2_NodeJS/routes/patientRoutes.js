const express = require("express");
const router = express.Router();
const authenticate = require("../middlewares/auth");
const roleAuth = require("../middlewares/roleAuth");
const {
  bookAppointment,
  viewOwnAppointments,
  raiseSupportTicket,
} = require("../controllers/patientController");

// All routes require authentication and patient role
router.use(authenticate);
router.use(roleAuth("patient"));

router.post("/appointments", bookAppointment);
router.get("/appointments", viewOwnAppointments);
router.post("/support-tickets", raiseSupportTicket);

module.exports = router;

