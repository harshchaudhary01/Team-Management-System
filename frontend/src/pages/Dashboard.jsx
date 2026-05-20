import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

const statusOptions = [
  "Pending",
  "In Progress",
  "Completed",
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [projectForm, setProjectForm] = useState({
    title: "",
    description: "",
  });
  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    project: "",
    status: "Pending",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const getAuthConfig = () => {
    const userInfo = JSON.parse(
      localStorage.getItem("userInfo") || "null"
    );

    if (!userInfo?.token) {
      navigate("/");
      return null;
    }

    return {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const config = getAuthConfig();
    if (!config) return;

    try {
      setLoading(true);
      const [projectData, taskData] = await Promise.all([
        API.get("/projects", config),
        API.get("/tasks", config),
      ]);

      setProjects(projectData.data);
      setTasks(taskData.data);
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        "Unable to load dashboard data.";
      setError(message);
      if (err?.response?.status === 401) {
        localStorage.removeItem("userInfo");
        navigate("/");
      }
    } finally {
      setLoading(false);
    }
  };

  const clearMessages = () => {
    setError("");
    setSuccess("");
  };

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    clearMessages();
    const config = getAuthConfig();
    if (!config) return;

    try {
      await API.post("/projects", projectForm, config);
      setSuccess("Project created successfully.");
      setProjectForm({ title: "", description: "" });
      fetchData();
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Failed to create project."
      );
    }
  };

  const handleTaskSubmit = async (e) => {
    e.preventDefault();
    clearMessages();
    const config = getAuthConfig();
    if (!config) return;

    try {
      await API.post("/tasks", taskForm, config);
      setSuccess("Task created successfully.");
      setTaskForm({
        title: "",
        description: "",
        project: "",
        status: "Pending",
      });
      fetchData();
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Failed to create task."
      );
    }
  };

  const handleDeleteProject = async (projectId) => {
    clearMessages();
    const config = getAuthConfig();
    if (!config) return;

    try {
      await API.delete(`/projects/${projectId}`, config);
      setSuccess("Project deleted successfully.");
      fetchData();
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Failed to delete project."
      );
    }
  };

  const handleDeleteTask = async (taskId) => {
    clearMessages();
    const config = getAuthConfig();
    if (!config) return;

    try {
      await API.delete(`/tasks/${taskId}`, config);
      setSuccess("Task deleted successfully.");
      fetchData();
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Failed to delete task."
      );
    }
  };

  const handleStatusUpdate = async (taskId, status) => {
    clearMessages();
    const config = getAuthConfig();
    if (!config) return;

    try {
      await API.put(`/tasks/${taskId}`, { status }, config);
      setSuccess("Task status updated.");
      fetchData();
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Unable to update task status."
      );
    }
  };

  const projectTaskCount = (projectId) =>
    tasks.filter((task) => task.project?._id === projectId).length;

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 md:p-10">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-5xl font-bold">Team Management</h1>
          <p className="mt-2 text-slate-300 max-w-2xl">
            Create projects, add tasks, update status, and manage work in one place.
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="rounded-full bg-purple-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-purple-500"
        >
          Logout
        </button>
      </div>

      {(error || success) && (
        <div className="mt-6 max-w-3xl space-y-2">
          {success && (
            <div className="rounded-2xl bg-emerald-600/20 border border-emerald-500 p-4 text-emerald-100">
              {success}
            </div>
          )}
          {error && (
            <div className="rounded-2xl bg-red-600/20 border border-red-500 p-4 text-red-100">
              {error}
            </div>
          )}
        </div>
      )}

      <div className="grid gap-6 pt-8 lg:grid-cols-3">
        <div className="rounded-3xl bg-slate-900/90 p-8 shadow-xl">
          <h2 className="text-2xl font-semibold text-white">Projects</h2>
          <p className="mt-5 text-5xl font-bold">{projects.length}</p>
          <p className="mt-3 text-slate-300">
            Projects you own and manage.
          </p>
        </div>

        <div className="rounded-3xl bg-slate-900/90 p-8 shadow-xl">
          <h2 className="text-2xl font-semibold text-white">Tasks</h2>
          <p className="mt-5 text-5xl font-bold">{tasks.length}</p>
          <p className="mt-3 text-slate-300">
            Total tasks across all your projects.
          </p>
        </div>

        <div className="rounded-3xl bg-slate-900/90 p-8 shadow-xl">
          <h2 className="text-2xl font-semibold text-white">Completed</h2>
          <p className="mt-5 text-5xl font-bold">
            {tasks.filter((task) => task.status === "Completed").length}
          </p>
          <p className="mt-3 text-slate-300">Finished tasks ready to review.</p>
        </div>
      </div>

      <div className="mt-10 grid gap-6 xl:grid-cols-[1.2fr_1fr]">
        <section className="rounded-3xl bg-slate-900/80 p-8 shadow-xl">
          <h2 className="text-3xl font-semibold mb-4">Create a New Project</h2>
          <form onSubmit={handleProjectSubmit} className="space-y-4">
            <input
              value={projectForm.title}
              onChange={(e) =>
                setProjectForm({
                  ...projectForm,
                  title: e.target.value,
                })
              }
              placeholder="Project title"
              className="w-full rounded-2xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-white outline-none transition focus:border-purple-500"
            />
            <textarea
              value={projectForm.description}
              onChange={(e) =>
                setProjectForm({
                  ...projectForm,
                  description: e.target.value,
                })
              }
              rows={4}
              placeholder="Project description"
              className="w-full rounded-2xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-white outline-none transition focus:border-purple-500"
            />
            <button
              type="submit"
              className="rounded-2xl bg-purple-600 px-5 py-3 font-semibold text-white transition hover:bg-purple-500"
            >
              Create Project
            </button>
          </form>

          <div className="mt-12">
            <h3 className="text-2xl font-semibold mb-4">Active Projects</h3>
            <div className="space-y-4">
              {projects.length === 0 ? (
                <p className="text-slate-400">
                  No projects yet. Add one to organize tasks.
                </p>
              ) : (
                projects.map((project) => (
                  <div
                    key={project._id}
                    className="rounded-3xl border border-slate-700 bg-slate-950 p-5"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h4 className="text-xl font-semibold">
                          {project.title}
                        </h4>
                        <p className="mt-2 text-slate-400">
                          {project.description || "No description provided."}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDeleteProject(project._id)}
                        className="rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500"
                      >
                        Delete
                      </button>
                    </div>
                    <p className="mt-4 text-slate-300 text-sm">
                      Tasks: {projectTaskCount(project._id)}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        <section className="rounded-3xl bg-slate-900/80 p-8 shadow-xl">
          <h2 className="text-3xl font-semibold mb-4">Add a New Task</h2>
          <form onSubmit={handleTaskSubmit} className="space-y-4">
            <input
              value={taskForm.title}
              onChange={(e) =>
                setTaskForm({
                  ...taskForm,
                  title: e.target.value,
                })
              }
              placeholder="Task title"
              className="w-full rounded-2xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-white outline-none transition focus:border-blue-500"
            />
            <textarea
              value={taskForm.description}
              onChange={(e) =>
                setTaskForm({
                  ...taskForm,
                  description: e.target.value,
                })
              }
              rows={4}
              placeholder="Task description"
              className="w-full rounded-2xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-white outline-none transition focus:border-blue-500"
            />
            <select
              value={taskForm.project}
              onChange={(e) =>
                setTaskForm({
                  ...taskForm,
                  project: e.target.value,
                })
              }
              className="w-full rounded-2xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-white outline-none transition focus:border-blue-500"
            >
              <option value="">Select project (optional)</option>
              {projects.map((project) => (
                <option key={project._id} value={project._id}>
                  {project.title}
                </option>
              ))}
            </select>
            <select
              value={taskForm.status}
              onChange={(e) =>
                setTaskForm({
                  ...taskForm,
                  status: e.target.value,
                })
              }
              className="w-full rounded-2xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-white outline-none transition focus:border-blue-500"
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="rounded-2xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-500"
            >
              Create Task
            </button>
          </form>
        </section>
      </div>

      <section className="mt-10">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-3xl font-semibold">Task List</h2>
            <p className="mt-2 text-slate-400">
              Manage tasks, update status, or delete them when complete.
            </p>
          </div>
          <div className="inline-flex items-center gap-3 rounded-3xl bg-slate-900/80 p-4 text-sm text-slate-300">
            <span className="font-semibold">Filter:</span>
            <span className="text-white">All</span>
          </div>
        </div>

        {loading ? (
          <div className="mt-8 text-slate-300">
            Loading your projects and tasks...
          </div>
        ) : tasks.length === 0 ? (
          <div className="mt-8 rounded-3xl border border-dashed border-slate-700 bg-slate-950 p-8 text-slate-300">
            No tasks exist yet. Create a task to begin.
          </div>
        ) : (
          <div className="mt-8 grid gap-6 xl:grid-cols-3">
            {tasks.map((task) => (
              <div
                key={task._id}
                className="rounded-3xl border border-slate-700 bg-slate-950 p-6 shadow-lg"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-2xl font-semibold">{task.title}</h3>
                    <p className="mt-2 text-slate-400">
                      {task.project?.title || "No project"}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteTask(task._id)}
                    className="rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-500"
                  >
                    Delete
                  </button>
                </div>
                <p className="mt-4 text-slate-300">
                  {task.description || "No task description."}
                </p>
                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <span className="rounded-full bg-slate-800 px-3 py-1 text-sm text-slate-200">
                    {task.status}
                  </span>
                  {task.status !== "Completed" && (
                    <button
                      onClick={() =>
                        handleStatusUpdate(
                          task._id,
                          task.status === "Pending"
                            ? "In Progress"
                            : "Completed"
                        )
                      }
                      className="rounded-2xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-500"
                    >
                      Mark {task.status === "Pending" ? "In Progress" : "Completed"}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
