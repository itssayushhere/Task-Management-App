/* eslint-disable react/prop-types */
import { AnimatePresence, motion } from "framer-motion";
import { useContext, useState } from "react";
import { AuthContext } from "../Auth/AuthContext.jsx";
import { FaPencilAlt, FaTimes, FaSave } from "react-icons/fa";

const TaskCard = ({ task, onSave }) => {
  const { title, description, dueDate, priority, status, assignedUser } = task;
  const user = assignedUser.map((item) => item.name);
  const [edit, setEdit] = useState(false);
  const { state } = useContext(AuthContext);

  // Local state for form inputs
  const [editedTitle, setEditedTitle] = useState(title);
  const [editedDescription, setEditedDescription] = useState(description);
  const [editedDueDate, setEditedDueDate] = useState(dueDate);
  const [editedPriority, setEditedPriority] = useState(priority);
  const [editedStatus, setEditedStatus] = useState(status);

  const handleSave = () => {
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

  return (
    <motion.div
    layout
    className="bg-black shadow-lg rounded-lg p-5 m-4  transition-transform transform hover:scale-105 hover:shadow-xl w-80 relative"
  >
    {state.role === "admin" && (
  <motion.button
    initial={{ opacity: 0, scale: 0.8 }} // Starting animation properties
    animate={{ opacity: 1, scale: 1, top: edit ? "0.25rem" : "1rem", right: edit ? "0.25rem" : "0.75rem" }} // Animate scale, opacity, and position
    exit={{ opacity: 0, scale: 0.8 }} // Exit animation
    transition={{ duration: 0.3, ease: "easeInOut" }} // Smoother transition
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
            <option value="pending">Pending</option>
            <option value="in progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          <button
            onClick={handleSave}
            className="w-full p-2 bg-purple-600 text-white rounded"
          >
            Save
          </button>
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


// Updated TaskList component with page transition and task editing
const TaskList = ({ tasks, onUpdateTask }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [direction, setDirection] = useState(0);
  const tasksPerPage = 4;

  const lastTaskIndex = currentPage * tasksPerPage;
  const firstTaskIndex = lastTaskIndex - tasksPerPage;

  const currentTasks = tasks.slice(firstTaskIndex, lastTaskIndex);
  const totalPages = Math.ceil(tasks.length / tasksPerPage);

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
    duration: 0.3,
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
                onSave={onUpdateTask} // Handle task update
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
