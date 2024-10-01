import { useEffect, useState } from "react";
import Loading from "react-loading";
import { AnimatePresence, motion } from "framer-motion"; // Import Framer Motion
import InputMembers from "./InputMembers";
import { toast } from "react-toastify";
import TaskList from "./TaskCard";
const baseUrl = `${import.meta.env.VITE_BASEURL}/user`;

const fetchUsers = async () => {
  const response = await fetch(baseUrl);
  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }
  return response.json();
};

// eslint-disable-next-line react/prop-types
const Teamtask = ({ name, role }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [priority, setPriority] = useState("low");
  const [dueDate, setDueDate] = useState("");
  const [task, settask] = useState([]);
  console.log(task);
  const taskUrl = `${import.meta.env.VITE_BASEURL}/task`; // Adjust the endpoint as necessary
  const getUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchUsers();
      setUsers(data.users);
      settask(data.tasks);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getUsers();
  }, []);
  const containerVariants = {
    hidden: { height: 0, opacity: 0 },
    visible: { height: "300px", opacity: 1 },
    exit: { height: 0, opacity: 0 },
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
    setSelectedMembers([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedMembers.length === 0) {
      return setError("Assign this task to anyone");
    }
    // Gather task data
    const taskData = {
      title: e.target.title.value,
      description: e.target.description.value,
      assignedUser: selectedMembers, // Use selected members
      priority,
      dueDate,
      taskType: "team",
    };

    try {
      const response = await fetch(taskUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(taskData),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      getUsers();
      toast.success("Assigned");
    } catch (error) {
      console.error("Error creating task:", error.message);
      // Handle error (e.g., show an error message to the user)
    } finally {
      toggleModal(); // Close the modal after submission
    }
  };

  return (
    <div>
      {loading && (
        <div className="mt-10 w-full flex items-center justify-center">
          <Loading type="bars" color="white" />
        </div>
      )}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && (
        <div>
          <div>
            <TaskList tasks={task} />
          </div>
          <div>
            <button
              type="button"
              onClick={() => setOpen(!open)}
              className="w-full border-b-2 text-md font-bold font-mono p-2 bg-purple-600/50 rounded-lg text-white"
            >
              {open ? "Hide Team Members" : "Show Team Members"}
            </button>
            <motion.div
              className="overflow-y-scroll hidden-scrollbar"
              initial="hidden"
              animate={open ? "visible" : "hidden"}
              exit="exit"
              variants={containerVariants}
              transition={{ duration: 0.5 }}
              style={{ backgroundColor: "#000000", borderRadius: "10px" }} // Add black background and round the corners
            >
              {users.length > 0 ? (
                <div className="p-4 space-y-4">
                  {users.map((user) => (
                    <div
                      key={user._id}
                      className="p-4 border border-purple-600 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 bg-black" // Darker background for the user card
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-xl font-normal text-white">
                            {user.name === name ? (
                              <p className="text-purple-200 font-bold">
                                {user.name}(you)
                              </p>
                            ) : (
                              user.name
                            )}
                          </span>
                          <span className="text-gray-400 text-sm block">
                            {user.email}
                          </span>
                        </div>
                        <span
                          className={`text-sm font-medium px-2 py-1 rounded ${
                            user.role === "admin"
                              ? "bg-red-700 text-white"
                              : "bg-blue-500 text-white"
                          }`}
                        >
                          {user.role}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                !loading && <p className="text-purple-400">No users found.</p>
              )}
            </motion.div>
          </div>
          {role === "admin" && (
            <div className="flex items-center justify-center">
              {/* Button to open modal */}
              <button
                className="p-2 rounded-lg mt-2 bg-green-500 font-bold font-serif"
                onClick={toggleModal}
              >
                Create Task
              </button>

              {/* Modal */}
              <AnimatePresence>
                {isModalOpen && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 flex items-center justify-center bg-black/30 text-black "
                  >
                    <div className="bg-white p-5 rounded-xl shadow-lg border-2 border-black ">
                      <h2 className="text-xl font-bold mb-4">
                        Create New Task
                      </h2>

                      {/* Task Form */}
                      <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                          <label className="block text-sm font-medium">
                            Title
                          </label>
                          <input
                            type="text"
                            name="title"
                            className="mt-1 p-2 border rounded-lg w-full"
                            placeholder="Task title"
                            required
                          />
                        </div>

                        <div className="mb-4">
                          <label className="block text-sm font-medium">
                            Description
                          </label>
                          <textarea
                            name="description"
                            className="mt-1 p-2 border rounded-lg w-full"
                            placeholder="Task description"
                            required
                          />
                        </div>

                        <InputMembers
                          allUsers={users}
                          selectedMembers={selectedMembers}
                          setSelectedMembers={setSelectedMembers}
                        />
                        <div className="mb-4">
                          <label className="block text-sm font-medium">
                            Priority
                          </label>
                          <select
                            value={priority}
                            onChange={(e) => setPriority(e.target.value)}
                            className="mt-1 p-2 border rounded-lg w-full"
                          >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                          </select>
                        </div>

                        <div className="mb-4">
                          <label className="block text-sm font-medium">
                            Due Date
                          </label>
                          <input
                            type="date"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            className="mt-1 p-2 border rounded-lg w-full"
                            required
                          />
                        </div>

                        <div className="flex justify-center gap-4">
                          <button
                            type="button"
                            className="bg-red-500 text-white p-2 rounded-lg px-3"
                            onClick={toggleModal}
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="bg-blue-500 text-white p-2 rounded-lg"
                          >
                            Save Task
                          </button>
                        </div>
                      </form>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Teamtask;
