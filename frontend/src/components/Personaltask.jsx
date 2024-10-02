import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import PersonalTaskList from "./PersonalTaskList";
import ReactLoading from "react-loading"; // Import ReactLoading
const Personaltask = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("low");
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState("To Do");
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserData = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${import.meta.env.VITE_BASEURL}/user/me`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }

      const data = await response.json();
      setUser(data.tasks);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setError(error.message); // Set error message
    } finally {
      setLoading(false); // Set loading to false
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const toggleModal = () => {
    setIsModalOpen((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newTask = {
      title,
      description,
      priority,
      dueDate,
      status,
      taskType: "personal",
    };
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("No token, authorization denied, try relogin");
      return;
    }
    try {
      const response = await fetch(`${import.meta.env.VITE_BASEURL}/task`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newTask),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Task created:", result);
        toast.success("Task Created");
        setTitle("");
        setDescription("");
        setDueDate("");
        setStatus("To Do");
        setPriority("low");
        fetchUserData()
        toggleModal()
        
      } else {
        const errorData = await response.json();
        toast.error("Error creating task");
        console.error("Error creating task:", errorData.error);
      }
    } catch (error) {
      toast.error("Error creating task");
      console.error("Error:", error);
    }
  };

  return (
    <div>
      <div className="flex flex-col items-center justify-center">
        {loading ? (
          <ReactLoading type="bars" color="#ffffff" height={50} width={50} />
        ) : error ? (
          <div className="bg-red-200 text-red-700 p-4 rounded-md mb-4">
            {error}
          </div>
        ) : user && (
          <PersonalTaskList tasks={user} recall={fetchUserData}/>
        ) }
         <button
          className="p-2 rounded-lg mt-2 bg-green-500 font-bold font-serif"
          onClick={toggleModal}
        >
          Create Task
        </button>

        <AnimatePresence>
          {isModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 flex items-center justify-center bg-black/30 text-black"
            >
              <div className="bg-white p-5 rounded-xl shadow-lg border-2 border-black w-80 sm:w-96">
                <h2 className="text-xl font-bold mb-4"> Personal Task</h2>

                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium">Title</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
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
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="mt-1 p-2 border rounded-lg w-full"
                      placeholder="Task description"
                      required
                    />
                  </div>

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

                  <div className="mb-4">
                    <label className="block text-sm font-medium">Status</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="mt-1 p-2 border rounded-lg w-full"
                    >
                      <option value="To Do">To Do</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
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
    </div>
  );
};

export default Personaltask;
