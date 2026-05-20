const express = require("express");

const router = express.Router();

const protect = require("../middlewares/authMiddleware");

const {
  createProject,
  getProjects,
  getSingleProject,
  updateProject,
  deleteProject,
} = require("../controllers/projectController");

router.route("/")
  .post(protect, createProject)
  .get(protect, getProjects);

router.route("/:id")
  .get(protect, getSingleProject)
  .put(protect, updateProject)
  .delete(protect, deleteProject);

module.exports = router;