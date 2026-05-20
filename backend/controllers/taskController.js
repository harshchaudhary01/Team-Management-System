const Task = require("../models/Task");
const Project = require("../models/Project");

exports.createTask = async (req, res) => {
  try {
    const { title, description, project, status } =
      req.body;

    if (project) {
      const projectData = await Project.findById(project);
      if (!projectData) {
        return res.status(404).json({
          message: "Project not found",
        });
      }
      if (projectData.createdBy.toString() !== req.user.id) {
        return res.status(401).json({
          message: "Not authorized to add tasks to this project",
        });
      }
    }

    const task = await Task.create({
      title,
      description,
      status: status || "Pending",
      project: project || null,
      createdBy: req.user.id,
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({
      createdBy: req.user.id,
    }).populate("project");

    res.json(tasks);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const { title, description, status } =
      req.body;

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    if (task.createdBy.toString() !== req.user.id) {
      return res.status(401).json({
        message: "Not authorized to update this task",
      });
    }

    task.title = title || task.title;
    task.description =
      description || task.description;
    task.status = status || task.status;

    const updatedTask = await task.save();

    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    if (task.createdBy.toString() !== req.user.id) {
      return res.status(401).json({
        message: "Not authorized to delete this task",
      });
    }

    await task.deleteOne();

    res.json({
      message: "Task deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};