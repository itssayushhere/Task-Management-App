import { useContext, useState } from "react";
import { AuthContext } from "../Auth/AuthContext"; // Adjust the import path
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection

const Dashboard = () => {
  const { state, dispatch } = useContext(AuthContext);
  const [logout, setLogout] = useState(false);
  const [showlogout, setShowlogout] = useState(false);
  const [tab, setTab] = useState("team");
  const navigate = useNavigate(); // Hook to programmatically navigate

  const handleLogout = () => {
    // Dispatch logout action
    dispatch({ type: "LOGOUT" });
    navigate("/login"); // Redirect to login page
  };

  return (
    <div className="w-full ">
      <nav className="bg-purple-500 p-2 flex items-center justify-between sm:px-10 px-2  rounded-xl m-2">
        <div className="flex flex-row items-center justify-center">
          <button
            className="text-3xl text-black font-bold font-mono px-3 gap-0 flex flex-col items-center"
            onClick={() => setShowlogout(!showlogout)}
          >
            <span>Task.M</span>
            <span className="text-xs font-bold text-white">{state.name}</span>
          </button>
          {showlogout && <button className=" p-1 bg-white text-black rounded-lg text-xs font-bold font-mono" onClick={()=>setLogout(true)}>logout</button>}
        </div>
        <div className="flex gap-4 text-lg text-bold font-bold font-serif">
          <button
            onClick={() => setTab("team")}
            className={`${tab === "team" ? "text-white border-b-2" : ""}`}
          >
            Team
          </button>
          <button
            onClick={() => setTab("personal")}
            className={`${tab === "personal" ? "text-white border-b-2" : ""}`}
          >
            Personal
          </button>
        </div>
      </nav>

      {logout && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-md">
            <h2 className="text-lg font-bold mb-4">Confirm Logout</h2>
            <p>Are you sure you want to log out?</p>
            <div className="flex justify-end mt-4">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded mr-2"
                onClick={handleLogout}
              >
                Yes
              </button>
              <button
                className="bg-gray-300 text-black px-4 py-2 rounded"
                onClick={() => setLogout(false)}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
