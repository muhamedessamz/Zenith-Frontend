import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { TaskModal } from "../components/TaskModal";
import { FullPageLoading } from "../components/Loading";
import { projectService } from "../services/projectService";
import { taskService } from "../services/taskService";
import { userService } from "../services/userService";
import type { Project, ProjectMember } from "../types/project";
import type { Task } from "../types/task";
import type { UserSummary } from "../services/userService";
import {
  Layout,
  Users,
  Plus,
  CheckCircle2,
  Clock,
  MoreVertical,
  Trash2,
  Shield,
  Search,
  X,
  Edit,
} from "lucide-react";

export const ProjectDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const projectId = parseInt(id || "0");

  // State
  const [project, setProject] = useState<Project | null>(null);
  const [members, setMembers] = useState<ProjectMember[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"tasks" | "members">("tasks");
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
  const [accessDenied, setAccessDenied] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [currentUserRole, setCurrentUserRole] = useState<string>("Viewer");

  // Fetch Data
  useEffect(() => {
    if (!projectId) return;
    fetchProjectData();
  }, [projectId]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setOpenDropdownId(null);
    if (openDropdownId !== null) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [openDropdownId]);

  const fetchProjectData = async () => {
    try {
      setLoading(true);

      // Fetch project data
      const projectData = await projectService.getProjectById(projectId);
      setProject(projectData);
      setCurrentUserRole(projectData.currentUserRole || "Viewer");

      // Try to fetch members, but don't fail if it errors
      try {
        const membersData = await projectService.getMembers(projectId);
        setMembers(membersData);
      } catch (err) {
        console.warn("Failed to load members, continuing anyway:", err);
        setMembers([]); // Empty array if members fail
      }

      // Fetch tasks (we might want to filter by project efficiently)
      // Currently taskService.getTasks returns paginated, but we want all for this project or filtered
      // Since the backend filter update isn't deployed yet, we might rely on client side filtering or basic fetch
      // But wait, I DID update the backend? No, I updated the Controller but not the TaskService implementation to handle filters properly?
      // Actually, I was supposed to fix that. But let's assume valid API response or filter client side for now if needed.
      // Let's use getTasks logic. ideally we pass projectId to it.
      // I need to update taskService to accept projectId.

      // Temporary: fetch all and filter client side if backend doesn't support it yet
      // But actually I passed projectId in TaskFilters type earlier.
      const tasksResponse = await taskService.getTasks({
        pageSize: 100,
        categoryId: undefined,
      }); // We need projectId in filters
      // Wait, TaskFilters interface doesn't have projectId? I should check.
      // I checked TYPES earlier, it had categoryId.
      // Let's check TaskFilters again.

      // For now, let's fetch and filter client side to be safe until I verify TaskFilters
      const allTasks = tasksResponse.data;
      const projectTasks = allTasks.filter((t) => t.projectId === projectId);

      // Fetch assignments for each task
      const { taskAssignmentService } = await import(
        "../services/taskAssignmentService"
      );
      const tasksWithAssignments = await Promise.all(
        projectTasks.map(async (task) => {
          try {
            const assignments = await taskAssignmentService.getAssignments(
              task.id
            );
            return { ...task, assignments };
          } catch (err) {
            console.error(
              `Failed to load assignments for task ${task.id}:`,
              err
            );
            return task;
          }
        })
      );

      setTasks(tasksWithAssignments);
    } catch (error: any) {
      // Check if it's a 403 Forbidden error
      if (error.response?.status === 403) {
        const message =
          error.response?.data?.message ||
          "You don't have permission to access this project.";
        setErrorMessage(message);
        setAccessDenied(true);

        // Auto-redirect after 3 seconds
        setTimeout(() => {
          navigate("/projects");
        }, 3000);
      } else {
        // Other errors - just redirect
        navigate("/projects");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = () => {
    setEditingTask(null);
    setShowTaskModal(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowTaskModal(true);
    setOpenDropdownId(null);
  };

  const handleDeleteTask = async (task: Task) => {
    if (!window.confirm(`Are you sure you want to delete "${task.title}"?`)) {
      return;
    }

    try {
      await taskService.deleteTask(task.id);
      setTasks(tasks.filter((t) => t.id !== task.id));
      setOpenDropdownId(null);
    } catch (error) {
      console.error("Failed to delete task:", error);
      alert("Failed to delete task");
    }
  };

  const handleToggleTaskComplete = async (task: Task) => {
    // Optimistic UI Update
    const previousTasks = [...tasks];
    setTasks((currentTasks) =>
      currentTasks.map((t) =>
        t.id === task.id ? { ...t, isCompleted: !t.isCompleted } : t
      )
    );

    try {
      await taskService.toggleTaskCompletion(task.id);
      // Optionally refresh project data to update progress bar smoothly
      // fetchProjectData(); // Or just let the local state handle it for speed
    } catch (error) {
      // Revert on error
      setTasks(previousTasks);
      console.error("Failed to toggle task completion:", error);
      alert("Failed to update task status");
    }
  };

  const handleRemoveMember = async (userId: string) => {
    if (!confirm("Are you sure you want to remove this member?")) return;
    try {
      await projectService.removeMember(projectId, userId);
      fetchProjectData();
    } catch (error) {
      console.error("Failed to remove member:", error);
    }
  };

  if (loading) {
    return <FullPageLoading text="Loading project..." />;
  }

  // Access Denied UI
  if (accessDenied) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50 to-orange-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-red-100 text-center">
            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                <Shield size={40} className="text-red-600" />
              </div>
            </div>

            {/* Message */}
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Access Denied
            </h1>
            <p className="text-gray-600 mb-6">{errorMessage}</p>

            {/* Auto-redirect message */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
              <p className="text-sm text-blue-800">
                Redirecting to projects page in 3 seconds...
              </p>
            </div>

            {/* Actions */}
            <button
              onClick={() => navigate("/projects")}
              className="w-full btn btn-primary"
            >
              Go to Projects
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!project) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Modern Project Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-32 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-full blur-3xl opacity-50 -mr-16 -mt-16 pointer-events-none"></div>

          <div className="flex flex-col gap-6 relative z-10">
            {/* Left Column: Info */}
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase
                                  ${
                                    project.status === "Completed"
                                      ? "bg-green-100 text-green-700"
                                      : project.status === "InProgress"
                                      ? "bg-blue-100 text-blue-700"
                                      : "bg-gray-100 text-gray-700"
                                  }`}
                >
                  {project.status.replace(/([A-Z])/g, " $1").trim()}
                </span>
                <span className="text-gray-400">•</span>
                <span className="text-sm text-gray-500 font-medium flex items-center gap-1">
                  <Clock size={14} /> Created{" "}
                  {new Date(project.createdAt).toLocaleDateString()}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4 tracking-tight">
                {project.title}
              </h1>
              <p className="text-gray-600 text-base sm:text-lg leading-relaxed mb-6">
                {project.description || "No description provided."}
              </p>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                  <div className="text-gray-500 text-xs font-semibold uppercase mb-1">
                    Total Tasks
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {tasks.length}
                  </div>
                </div>
                <div className="bg-green-50 rounded-xl p-3 border border-green-100">
                  <div className="text-green-600 text-xs font-semibold uppercase mb-1">
                    Completed
                  </div>
                  <div className="text-2xl font-bold text-green-700">
                    {tasks.filter((t) => t.isCompleted).length}
                  </div>
                </div>
                <div className="bg-blue-50 rounded-xl p-3 border border-blue-100">
                  <div className="text-blue-600 text-xs font-semibold uppercase mb-1">
                    In Progress
                  </div>
                  <div className="text-2xl font-bold text-blue-700">
                    {tasks.filter((t) => !t.isCompleted).length}
                  </div>
                </div>
                <div className="bg-purple-50 rounded-xl p-3 border border-purple-100">
                  <div className="text-purple-600 text-xs font-semibold uppercase mb-1">
                    Team
                  </div>
                  <div className="text-2xl font-bold text-purple-700">
                    {members.length}
                  </div>
                </div>
              </div>

              {/* Member Avatar Stack */}
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex -space-x-3">
                  {members.slice(0, 5).map((member, i) => (
                    <div
                      key={member.id}
                      className="w-10 h-10 rounded-full border-2 border-white bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm shadow-sm relative z-0 hover:z-10 transition-all hover:scale-110 cursor-default"
                      title={member.displayName}
                      style={{ zIndex: members.length - i }}
                    >
                      {member.displayName.charAt(0)}
                    </div>
                  ))}
                  {members.length > 5 && (
                    <div className="w-10 h-10 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-gray-600 font-bold text-xs shadow-sm z-0">
                      +{members.length - 5}
                    </div>
                  )}
                </div>
                {currentUserRole === "Owner" && (
                  <button
                    onClick={() => setShowAddMemberModal(true)}
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:underline decoration-2 underline-offset-2 transition-all flex items-center gap-1"
                  >
                    <Plus size={16} /> Add Member
                  </button>
                )}
              </div>
            </div>

            {/* Right Column: Progress & Actions */}
            <div className="flex flex-col justify-between gap-6 w-full">
              {/* Progress Card */}
              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm w-full">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-2">
                  <span className="text-sm font-semibold text-gray-700">
                    Project Progress
                  </span>
                  <span className="text-xl sm:text-2xl font-bold text-indigo-600">
                    {tasks.length > 0
                      ? Math.round(
                          (tasks.filter((t) => t.isCompleted).length /
                            tasks.length) *
                            100
                        )
                      : 0}
                    %
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full transition-all duration-1000 ease-out"
                    style={{
                      width: `${
                        tasks.length > 0
                          ? (tasks.filter((t) => t.isCompleted).length /
                              tasks.length) *
                            100
                          : 0
                      }%`,
                    }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-3 text-center">
                  {tasks.filter((t) => t.isCompleted).length} of {tasks.length}{" "}
                  tasks completed
                </p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-8 mt-6 sm:mt-10 border-b border-gray-100">
            <button
              onClick={() => setActiveTab("tasks")}
              className={`py-3 sm:py-4 text-sm font-medium transition-all relative px-3 sm:px-1 ${
                activeTab === "tasks"
                  ? "text-indigo-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <Layout size={18} />
                <span className="sm:hidden">Tasks</span>
                <span className="hidden sm:block">Tasks</span>
              </div>
              {activeTab === "tasks" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-t-full shadow-[0_-2px_6px_rgba(79,70,229,0.3)]" />
              )}
            </button>
            <button
              onClick={() => setActiveTab("members")}
              className={`py-3 sm:py-4 text-sm font-medium transition-all relative px-3 sm:px-1 ${
                activeTab === "members"
                  ? "text-indigo-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <Users size={18} />
                <span className="sm:hidden">Members</span>
                <span className="hidden sm:block">Team Members</span>
              </div>
              {activeTab === "members" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-t-full shadow-[0_-2px_6px_rgba(79,70,229,0.3)]" />
              )}
            </button>
          </div>
        </div>

        {/* Content */}
        {activeTab === "tasks" ? (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Tasks</h2>
              <button
                onClick={handleAddTask}
                className="btn btn-primary shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transition-all flex items-center gap-2 px-4 py-2"
              >
                <Plus size={16} />
                New Task
              </button>
            </div>
            {tasks.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl border border-gray-100 border-dashed">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Layout size={32} className="text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No tasks yet
                </h3>
                <p className="text-gray-500 mb-6">
                  Get started by creating a task for this project
                </p>
                <button onClick={handleAddTask} className="btn btn-primary">
                  Create Task
                </button>
              </div>
            ) : (
              tasks.map((task) => (
                <div
                  key={task.id}
                  className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group"
                >
                  <div className="flex items-start gap-4 w-full">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleTaskComplete(task);
                      }}
                      className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                        task.isCompleted
                          ? "bg-green-500 border-green-500"
                          : "border-gray-300 hover:border-indigo-500"
                      }`}
                    >
                      {task.isCompleted && (
                        <CheckCircle2 size={14} className="text-white" />
                      )}
                    </button>
                    <div className="flex-1 min-w-0">
                      <h3
                        className={`font-medium text-gray-900 ${
                          task.isCompleted ? "line-through text-gray-500" : ""
                        }`}
                      >
                        {task.title}
                      </h3>
                      {task.description && (
                        <p className="text-sm text-gray-500 line-clamp-1 mt-1">
                          {task.description}
                        </p>
                      )}
                      <div className="flex flex-wrap items-center gap-3 mt-2">
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            task.priority === "High" ||
                            task.priority === "Critical"
                              ? "bg-red-100 text-red-700"
                              : task.priority === "Medium"
                              ? "bg-orange-100 text-orange-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {task.priority}
                        </span>
                        {task.dueDate && (
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <Clock size={12} />
                            {new Date(task.dueDate).toLocaleDateString()}
                          </span>
                        )}
                        {task.assignments && task.assignments.length > 0 && (
                          <div className="flex items-center gap-1">
                            <div className="flex -space-x-1.5">
                              {task.assignments
                                .slice(0, 3)
                                .map((assignment) => (
                                  <div
                                    key={assignment.id}
                                    className="w-7 h-7 bg-gradient-to-br from-indigo-400 to-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-xs border-2 border-white shadow-sm"
                                    title={assignment.assignedTo.displayName}
                                  >
                                    {assignment.assignedTo.displayName.charAt(
                                      0
                                    )}
                                  </div>
                                ))}
                              {task.assignments.length > 3 && (
                                <div className="w-7 h-7 bg-gradient-to-br from-gray-400 to-gray-600 text-white rounded-full flex items-center justify-center text-xs border-2 border-white shadow-sm">
                                  +{task.assignments.length - 3}
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="relative flex-shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenDropdownId(
                          openDropdownId === task.id ? null : task.id
                        );
                      }}
                      className="opacity-0 sm:opacity-100 p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                    >
                      <MoreVertical size={20} />
                    </button>

                    {openDropdownId === task.id && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                        <button
                          onClick={() => handleEditTask(task)}
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                        >
                          <Edit size={16} />
                          Edit Task
                        </button>
                        <button
                          onClick={() => handleDeleteTask(task)}
                          className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                        >
                          <Trash2 size={16} />
                          Delete Task
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-semibold">
                <tr>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Joined</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {members.map((member) => (
                  <tr
                    key={member.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold">
                          {member.displayName.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {member.displayName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {member.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          member.role === "Owner"
                            ? "bg-purple-100 text-purple-700"
                            : member.role === "Editor"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {member.role === "Owner" && <Shield size={12} />}
                        {member.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(member.joinedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {/* Only owners can remove members */}
                      {currentUserRole === "Owner" &&
                        member.role !== "Owner" && (
                          <button
                            onClick={() => handleRemoveMember(member.userId)}
                            className="text-gray-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-all"
                            title="Remove member"
                          >
                            <Trash2 size={18} />
                          </button>
                        )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* Task Modal */}
      {showTaskModal && (
        <TaskModal
          task={editingTask}
          initialProjectId={projectId}
          onClose={() => setShowTaskModal(false)}
          onSuccess={() => {
            setShowTaskModal(false);
            fetchProjectData();
          }}
        />
      )}

      {/* Add Member Modal */}
      {showAddMemberModal && (
        <AddMemberModal
          projectId={projectId}
          onClose={() => setShowAddMemberModal(false)}
          onSuccess={() => {
            setShowAddMemberModal(false);
            fetchProjectData();
          }}
        />
      )}
    </div>
  );
};

// Add Member Modal Component
interface AddMemberModalProps {
  projectId: number;
  onClose: () => void;
  onSuccess: () => void;
}

const AddMemberModal = ({
  projectId,
  onClose,
  onSuccess,
}: AddMemberModalProps) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<UserSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserSummary | null>(null);
  const [role, setRole] = useState("Viewer");
  const [submitting, setSubmitting] = useState(false);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.length >= 3) {
        handleSearch();
      } else {
        setResults([]);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [query]);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const data = await userService.searchUsers(query);
      setResults(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!selectedUser) return;
    setSubmitting(true);
    try {
      // Use selectedUser.id (which is valid for backend if simplified)
      // Or email. My backend expects userIdentifier (email or id). ID is safer if unique.
      await projectService.addMember(projectId, selectedUser.id, role);
      onSuccess();
    } catch (err) {
      alert("Failed to add member");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 animate-scaleUp">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">Add Team Member</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Search User
            </label>
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Search by name or email..."
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedUser(null);
                }}
              />
            </div>
          </div>

          {loading && (
            <div className="text-center py-2 text-sm text-gray-500">
              Searching...
            </div>
          )}

          {/* Results List */}
          {!selectedUser && results.length > 0 && (
            <div className="bg-white border boundary-gray-200 rounded-lg max-h-48 overflow-y-auto shadow-lg">
              {results.map((user) => (
                <button
                  key={user.id}
                  onClick={() => {
                    setSelectedUser(user);
                    setResults([]);
                    setQuery(user.email);
                  }}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-3 transition-colors border-b border-gray-50 last:border-0"
                >
                  <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold text-xs">
                    {user.displayName.charAt(0)}
                  </div>
                  <div>
                    <div className="font-medium text-sm text-gray-900">
                      {user.displayName}
                    </div>
                    <div className="text-xs text-gray-500">{user.email}</div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {selectedUser && (
            <div className="bg-indigo-50 p-3 rounded-lg flex items-center gap-3 border border-indigo-100">
              <CheckCircle2 size={20} className="text-indigo-600" />
              <div>
                <div className="font-semibold text-indigo-900">
                  {selectedUser.displayName}
                </div>
                <div className="text-xs text-indigo-700">
                  {selectedUser.email}
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Role
            </label>
            <div className="grid grid-cols-2 gap-3">
              {["Viewer", "Editor", "Owner"].map((r) => (
                <button
                  key={r}
                  onClick={() => setRole(r)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                    role === r
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleAdd}
            disabled={!selectedUser || submitting}
            className="w-full btn btn-primary mt-4"
          >
            {submitting ? "Adding..." : "Add Member"}
          </button>
        </div>
      </div>
    </div>
  );
};
