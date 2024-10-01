import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PersonalTaskList = ({ tasks }) => {
  // State for personal and team tasks

  const [personalTasks, setPersonalTasks] = useState([]);
  const [teamTasks, setTeamTasks] = useState([]);

  // Filter tasks into personal and team
  const filterTasks = () => {
    const personal = tasks.filter(task => task.taskType === 'personal');
    const team =  tasks.filter(task => task.taskType === 'team');

    setPersonalTasks(personal);
    setTeamTasks(team);
  };

  // Call the filter function when the component mounts
  useEffect(() => {
    filterTasks();
  }, [tasks]);

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-purple-600 text-2xl font-bold mb-4">Personal Tasks</h2>
      <AnimatePresence>
        {personalTasks.map(task => (
          <motion.div
          key={task._id}
          layout
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0}}
          // transition={{ duration: 0.5, ease: "easeInOut" }}
          className="bg-black shadow-lg rounded-lg p-5 m-4 w-80 h-auto"
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
      </AnimatePresence>

      <h2 className="text-purple-600 text-2xl font-bold mb-4">Team Tasks</h2>
      <AnimatePresence>
        {teamTasks.map(task => (
          <motion.div
          key={task._id}
          layout
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0}}
          // transition={{ duration: 0.5, ease: "easeInOut" }}
          className="bg-black shadow-lg rounded-lg p-5 m-4 w-80 h-auto"
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
      </AnimatePresence>
    </div>
  );
};

export default PersonalTaskList;
