const express = require("express");
const router = express.Router();
const authenticate = require("../middlewares/auth");
const roleAuth = require("../middlewares/roleAuth");
const {
  getAllUsers,
  getSystemStats,
  getDoctorsList,
  softDeleteUser,
  assignTicketToDoctor,
} = require("../controllers/adminController");

// All routes require authentication and admin role
router.use(authenticate);
router.use(roleAuth("admin"));

router.get("/users", getAllUsers);
router.get("/stats", getSystemStats);
router.get("/doctors", getDoctorsList);
router.patch("/users/:userId/deactivate", softDeleteUser);
router.patch("/support-tickets/:ticketId/assign", assignTicketToDoctor);

module.exports = router;

