import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";

const Personaltask = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("low");
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState("To Do"); // Added status state

  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

const fetchUserData = async () => {
  const token = JSON.parse(localStorage.getItem('token'))
  try {
    const response = await fetch('/me', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // Assuming you store the token in localStorage
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user data');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
};


  useEffect(() => {
    const getUserData = async () => {
      try {
        const userData = await fetchUserData();
        setUser(userData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    getUserData();
  }, []); // Empty dependency array means this runs once on mount
console.log(user)
  // Function to toggle modal
  const toggleModal = () => {
    setIsModalOpen((prev) => !prev);
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newTask = {
      title,
      description,
      priority,
      dueDate,
      status, 
      taskType: "personal",
    }
    const token = localStorage.getItem("token");
      if (!token) {
       toast.error("No token, authorization denied,try relogin");
        return;
      }
    try {
      const response = await fetch(`${import.meta.env.VITE_BASEURL}/task`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Assuming you're using a token-based system
        },
        body: JSON.stringify(newTask),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Task created:", result);
        toast.success("Task Created")
        setTitle("");
        setDescription("");
        setDueDate("");
        setStatus("To Do"); // Reset the status
        setPriority("low");
      } else {
        const errorData = await response.json();
        toast.error("error")
        console.error("Error creating task:", errorData.error);
      }
    } catch (error) {
      toast.error("error")
      console.error("Error:", error);
    }
  };

  return (
    <div>
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
              className="fixed inset-0 flex items-center justify-center bg-black/30 text-black"
            >
              <div className="bg-white p-5 rounded-xl shadow-lg border-2 border-black">
                <h2 className="text-xl font-bold mb-4">Create New Task</h2>

                {/* Task Form */}
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
                    <label className="block text-sm font-medium">Description</label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="mt-1 p-2 border rounded-lg w-full"
                      placeholder="Task description"
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium">Priority</label>
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
                    <label className="block text-sm font-medium">Due Date</label>
                    <input
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="mt-1 p-2 border rounded-lg w-full"
                      required
                    />
                  </div>

                  {/* Status input */}
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
