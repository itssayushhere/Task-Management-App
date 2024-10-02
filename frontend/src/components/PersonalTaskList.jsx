/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPencilAlt, FaTimes } from "react-icons/fa";
import { toast } from 'react-toastify';

const PersonalTaskList = ({ tasks,recall}) => {
  const [personalTasks, setPersonalTasks] = useState([]);
  const [teamTasks, setTeamTasks] = useState([]);
  const [editTaskId, setEditTaskId] = useState(null);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedDescription, setEditedDescription] = useState('');
  const [editedDueDate, setEditedDueDate] = useState('');
  const [editedPriority, setEditedPriority] = useState('low');
  const [editedStatus, setEditedStatus] = useState('To Do');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deletingTaskId, setDeletingTaskId] = useState(null);
const token = localStorage.getItem("token")
  const handleSave = async (taskData) => {
    try {
      if (!token) {
        toast.error("No token, authorization denied,try relogin");
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_BASEURL}/task/${taskData._id}`,
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
        recall()
      } else {
        console.error("Error updating task:", result.message);
        toast.error("Update failed");
      }
    } catch (error) {
      console.error("Error in fetch request:", error);
    }
  };
  const handleDelete= async (taskId) => {
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
        toast.success("Task deleted successfully"); // Notify success
        recall()
      } else {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error("Failed to delete task:", error);
      toast.error("Failed to delete task"); // Notify failure
    }
  };
  // Filter tasks into personal and team
  const filterTasks = () => {
    const personal = tasks.filter(task => task.taskType === 'personal');
    const team = tasks.filter(task => task.taskType === 'team');
    
    setPersonalTasks(personal);
    setTeamTasks(team);
  };

  useEffect(() => {
    filterTasks();
  }, [tasks]);


const handleEdit = (task) => {
  // If the current task ID is the same as the previous, set it to null
  if (editTaskId === task._id) {
    setEditTaskId(null); // Close the editor if the same task is clicked
  } else {
    // Set the editing task ID to the clicked task ID
    setEditTaskId(task._id);
    
    // Update the state for the edit fields with the current task's values
    setEditedTitle(task.title);
    setEditedDescription(task.description);
    setEditedDueDate(task.dueDate);
    setEditedPriority(task.priority);
    setEditedStatus(task.status);
  }
};

  const handleSaveClick = () => {
    const updatedTask = {
      _id: editTaskId,
      title: editedTitle,
      description: editedDescription,
      dueDate: editedDueDate,
      priority: editedPriority,
      status: editedStatus,
    };
    handleSave(updatedTask); // Call the parent component's save handler
    setEditTaskId(null); // Reset the edit mode
  };

  const handleDeleteClick = (taskId) => {
    setDeletingTaskId(taskId);
    setConfirmDelete(true);
  };

  const confirmDeleteClick = () => {
    handleDelete(deletingTaskId); // Call the parent component's delete handler
    setConfirmDelete(false);
    setDeletingTaskId(null);
  };

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-purple-600 text-2xl font-bold mb-4">Personal Tasks</h2>
      <div className='flex flex-wrap bg-black rounded-xl'>
      {personalTasks.map((task) => (
        <motion.div
          layout
          key={task._id}
          className="bg-black shadow-lg rounded-lg p-5 m-4 w-80 relative"
        >
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: 1,
              scale: 1,
              top: editTaskId === task._id ? "0.25rem" : "1rem",
              right: editTaskId === task._id ? "0.25rem" : "0.75rem",
            }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="absolute text-purple-600 z-50"
            onClick={() => handleEdit(task)}
          >
            {editTaskId === task._id ? <FaTimes /> : <FaPencilAlt />}
          </motion.button>

          <AnimatePresence mode="wait">
            {editTaskId === task._id ? (
              <motion.div
                key="edit-mode"
                layout
                initial={{ opacity: 0, height: 0, scale: 0.2 }}
                animate={{ opacity: 1, height: "auto", scale: 1 }}
                exit={{ opacity: 0, height: 0, scale: 0.2 }}
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
                  value={editedDueDate.split('T')[0]}
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
                    onClick={() => handleDeleteClick(task._id)}
                    className="w-full p-2 bg-red-700 text-white rounded"
                  >
                    Delete
                  </button>
                  <button
                    onClick={handleSaveClick}
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
                          onClick={confirmDeleteClick}
                          className="w-full p-2 bg-red-500 text-white rounded"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => setConfirmDelete(false)}
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
                <h3 className="text-xl font-bold text-purple-400">{task.title}</h3>
                <p className="text-gray-300">{task.description}</p>
                <div className="mt-3">
                  <p className="text-sm text-gray-400">
                    Due Date:{" "}
                    <span className="font-semibold text-purple-300">
                      {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                  </p>
                  <p className="text-sm text-gray-400">
                    Priority:{" "}
                    <span
                      className={`font-semibold ${
                        task.priority === "high"
                          ? "text-red-500"
                          : task.priority === "medium"
                          ? "text-yellow-500"
                          : "text-green-500"
                      }`}
                    >
                      {task.priority}
                    </span>
                  </p>
                  <p className="text-sm text-gray-400">
                    Status:{" "}
                    <span className="font-semibold text-purple-300">{task.status}</span>
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
</div>
      <h2 className="text-purple-600 text-2xl font-bold mb-4">Team Tasks</h2>
      <AnimatePresence>
        <div className='flex flex-wrap items-center justify-center'>
          {teamTasks.map(task => (
            <motion.div
              key={task._id}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-black shadow-lg rounded-lg p-5 m-4 w-80"
            >
              <h3 className="text-xl font-bold text-purple-400">{task.title}</h3>
              <p className="text-gray-300">{task.description}</p>
              <div className="mt-3">
                <p className="text-sm text-gray-400">
                  Due Date:{" "}
                  <span className="font-semibold text-purple-300">
                    {new Date(task.dueDate).toLocaleDateString()}
                  </span>
                </p>
                <p className="text-sm text-gray-400">
                  Priority:{" "}
                  <span
                    className={`font-semibold ${
                      task.priority === "high"
                        ? "text-red-500"
                        : task.priority === "medium"
                        ? "text-yellow-500"
                        : "text-green-500"
                    }`}
                  >
                    {task.priority}
                  </span>
                </p>
                <p className="text-sm text-gray-400">
                  Status:{" "}
                  <span className="font-semibold text-purple-300">{task.status}</span>
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </AnimatePresence>
    </div>
  );
};

export default PersonalTaskList;
