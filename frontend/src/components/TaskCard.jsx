/* eslint-disable react/prop-types */
import { AnimatePresence, motion } from "framer-motion";
import { useContext, useState } from "react";
import { AuthContext } from "../Auth/AuthContext.jsx";
import { FaPencilAlt, FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";

const TaskCard = ({ task, onSave, onDelete }) => { // Added onDelete prop
  const { title, description, dueDate, priority, status, assignedUser } = task;
  const user = assignedUser.map((item) => item.name);
  const [edit, setEdit] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false); // Local state for delete confirmation
  const { state } = useContext(AuthContext);

  // Local state for form inputs
  const [editedTitle, setEditedTitle] = useState(title);
  const [editedDescription, setEditedDescription] = useState(description);
  const [editedDueDate, setEditedDueDate] = useState(dueDate);
  const [editedPriority, setEditedPriority] = useState(priority);
  const [editedStatus, setEditedStatus] = useState(status);

  const handleSave = () => {
    // Check if any data has changed
    if (
      title === editedTitle &&
      description === editedDescription &&
      dueDate === editedDueDate &&
      priority === editedPriority &&
      status === editedStatus
    ) {
      toast.info("No changes.");
      setEdit(false); // Exit edit mode if no changes
      return;
    }

    // If there are changes, proceed with updating the task
    const updatedTask = {
      ...task,
      title: editedTitle,
      description: editedDescription,
      dueDate: editedDueDate,
      priority: editedPriority,
      status: editedStatus,
    };

    onSave(updatedTask); // Pass updated task to parent
    setEdit(false); // Exit edit mode
  };

  const handleDelete = async () => {
    try {
      await onDelete(task._id); // Call onDelete prop to delete the task
      toast.success("Task deleted successfully");
    } catch (error) {
      console.log(error)
      toast.error("Failed to delete task");
    }
  };

  return (
    <motion.div
      layout
      className="bg-black shadow-lg rounded-lg p-5 m-4 w-80 relative"
    >
      {state && state.role === "admin" && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: 1,
            scale: 1,
            top: edit ? "0.25rem" : "1rem",
            right: edit ? "0.25rem" : "0.75rem",
          }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="absolute text-purple-600 z-50"
          onClick={() => setEdit(!edit)}
        >
          {edit ? <FaTimes /> : <FaPencilAlt />}
        </motion.button>
      )}

      <AnimatePresence mode="wait">
        {edit ? (
          <motion.div
            key="edit-mode"
            layout
            initial={{ opacity: 0, height: 0, scale: 0.95 }}
            animate={{ opacity: 1, height: "auto", scale: 1 }}
            exit={{ opacity: 0, height: 0, scale: 0.95 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="space-y-3"
          >
            {/* Editable form */}
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="w-full p-2 bg-gray-700 text-white rounded"
            />
            <textarea
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
              className="w-full p-2 bg-gray-700 text-white rounded"
            />
            <input
              type="date"
              value={new Date(editedDueDate).toISOString().split("T")[0]}
              onChange={(e) => setEditedDueDate(e.target.value)}
              className="w-full p-2 bg-gray-700 text-white rounded"
            />
            <select
              value={editedPriority}
              onChange={(e) => setEditedPriority(e.target.value)}
              className="w-full p-2 bg-gray-700 text-white rounded"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            <select
              value={editedStatus}
              onChange={(e) => setEditedStatus(e.target.value)}
              className="w-full p-2 bg-gray-700 text-white rounded"
            >
              <option value="To Do">To do</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
            <div className="flex flex-row gap-3">
              <button
                onClick={() => setConfirmDelete(true)} // Show confirmation button
                className="w-full p-2 bg-red-700 text-white rounded"
              >
                Delete
              </button>
              <button
                onClick={handleSave}
                className="w-full p-2 bg-blue-700 text-white rounded"
              >
                Save
              </button>
            </div>

            <AnimatePresence>
              {confirmDelete && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col space-y-2 mt-3"
                >
                  <p className="text-red-400">Are you sure you want to delete this task?</p>
                  <div className="flex gap-2">
                    <button
                      onClick={handleDelete} // Call delete function
                      className="w-full p-2 bg-red-500 text-white rounded"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => setConfirmDelete(false)} // Hide confirmation button
                      className="w-full p-2 bg-gray-500 text-white rounded"
                    >
                      Cancel
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div
            key="static-mode"
            layout
            initial={{ opacity: 0, scale: 1.05, height: 0 }}
            animate={{ opacity: 1, scale: 1, height: "auto" }}
            exit={{ opacity: 0, scale: 0.95, height: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="h-10"
          >
            <h3 className="text-xl font-bold text-purple-400">{title}</h3>
            <p className="text-gray-300">{description}</p>
            <div className="mt-3">
              <p className="text-sm text-gray-400">
                Due Date:{" "}
                <span className="font-semibold text-purple-300">
                  {new Date(dueDate).toLocaleDateString()}
                </span>
              </p>
              <p className="text-sm text-gray-400">
                Priority:{" "}
                <span
                  className={`font-semibold ${
                    priority === "high"
                      ? "text-red-500"
                      : priority === "medium"
                      ? "text-yellow-500"
                      : "text-green-500"
                  }`}
                >
                  {priority}
                </span>
              </p>
              <p className="text-sm text-gray-400">
                Status:{" "}
                <span className="font-semibold text-purple-300">{status}</span>
              </p>
              <p className="text-sm text-gray-400">
                Assigned Users:{" "}
                <span className="font-semibold text-purple-300">
                  {user.join(", ")}
                </span>
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const TaskList = ({ tasks,pagenumber }) => {
  const [taskList, setTaskList] = useState(tasks); // Store task data locally
  const [direction, setDirection] = useState(0);
  const tasksPerPage = 4;
  const totalPages = Math.ceil(taskList.length / tasksPerPage);
  const [currentPage, setCurrentPage] = useState(pagenumber ? totalPages : 1);  
  const lastTaskIndex = currentPage * tasksPerPage;
  const firstTaskIndex = lastTaskIndex - tasksPerPage;
  const currentTasks = taskList.slice(firstTaskIndex, lastTaskIndex);
  const token = localStorage.getItem("token");
  
  const updateTask = async (taskId, taskData) => {
    try {
      if (!token) {
        toast.error("No token, authorization denied,try relogin");
        return;
      }
      const response = await fetch(
        `${import.meta.env.VITE_BASEURL}/task/${taskId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(taskData)
        }
      );
      
      const result = await response.json();
      if (response.ok) {
        toast.success("Updated successfully");
        setTaskList((prevTasks) =>
          prevTasks.map((task) =>
            task._id === taskId ? { ...task, ...taskData } : task
          )
        )
      } else {
        console.error("Error updating task:", result.message);
        toast.error("Update failed");
      }
    } catch (error) {
      console.error("Error in fetch request:", error);
    }
  };
  const deleteTask = async (taskId) => {
    const token = localStorage.getItem("token"); // Ensure token is retrieved here
    try {
      if (!token) {
        toast.error("No token, authorization denied, try relogin");
        return;
      }
      
      const response = await fetch(`${import.meta.env.VITE_BASEURL}/task/${taskId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
  
      if (response.ok) {
        // Only update the state if the deletion is successful
        setTaskList((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
        // toast.success("Task deleted successfully"); // Notify success
      } else {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error("Failed to delete task:", error);
      toast.error("Failed to delete task"); // Notify failure
    }
  };
  
  const nextPage = () => {
    if (currentPage < totalPages) {
      setDirection(1);
      setCurrentPage((prev) => prev + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setDirection(-1);
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleUpdateTask = async (updatedTask) => {
    await updateTask(updatedTask._id, updatedTask);
  };

  const pageVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.5,
  };

  return (
    <div className="flex flex-col items-center bg-black p-5">
      <div className="flex flex-wrap justify-center overflow-hidden">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentPage}
            custom={direction}
            variants={pageVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={pageTransition}
            className="flex flex-wrap justify-center"
          >
            {currentTasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onSave={handleUpdateTask} // Pass update handler to TaskCard
                onDelete={deleteTask}
              />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex justify-between w-full mt-4">
        <button
          onClick={prevPage}
          disabled={currentPage === 1}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
        >
          Previous
        </button>

        <span className="text-purple-200">
          Page {currentPage} of {totalPages}
        </span>

        <button
          onClick={nextPage}
          disabled={currentPage === totalPages}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default TaskList;
