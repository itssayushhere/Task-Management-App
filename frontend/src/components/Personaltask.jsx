import Loading from "react-loading";
import { useState, useEffect } from "react";

const Personaltask = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      setError(null);
      try {
        // Simulate fetching tasks (replace with real API call)
        const response = await new Promise((resolve) =>
          setTimeout(() => resolve([{ title: "Task 1" }, { title: "Task 2" }]), 1000)
        );
        setTasks(response);
      } catch (error) {
        setError("Failed to load tasks , error:",error.message);

      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  return (
    <div className="bg-purple-700/70 px-3 py-10">
      {loading && (
        <div className="w-full flex items-center justify-center mt-10">
          <Loading type="bars" color="white" />
        </div>
      )}
      {error && <p className="text-red-500 text-center">{error}</p>}
      {!loading && !error && (
        <div className="space-y-4">
          {tasks.length > 0 ? (
            tasks.map((task, index) => (
              <div key={index} className="p-4 bg-white text-black rounded-lg shadow-md">
                <h3 className="text-lg font-semibold">{task.title}</h3>
              </div>
            ))
          ) : (
            <p className="text-center text-white">No personal tasks available.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Personaltask;
