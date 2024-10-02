import { useContext, useState } from "react";
import { AuthContext } from "../Auth/AuthContext"; 
import { useNavigate } from "react-router-dom"; 
import { motion, AnimatePresence } from "framer-motion"; 
import Teamtask from "./Teamtask";
import Personaltask from "./personaltask";

const Dashboard = () => {
  const { state, dispatch } = useContext(AuthContext);
  const [logout, setLogout] = useState(false);
  const [showlogout, setShowlogout] = useState(false);
  const [tab, setTab] = useState("team");
  const navigate = useNavigate(); 
  
  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
    navigate("/login"); 
  };

  return (
    <div className="w-full">
      <nav className="bg-purple-500 p-2 flex items-center justify-between sm:px-10 px-2 rounded-xl m-2">
        <div className="flex flex-row items-center justify-center">
          <button
            className="text-3xl text-black font-bold font-mono px-3 gap-0 flex flex-col items-center"
            onClick={() => setShowlogout(!showlogout)}
          >
            <span>Task.M</span>
            <span className="text-xs font-bold text-white">{state.name}</span>
          </button>
          <AnimatePresence>
          {showlogout && (
            <motion.button
              className="p-1 bg-red-800 text-white rounded-lg text-xs font-bold font-mono px-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }} // Smooth exit transition
              onClick={() => setLogout(true)}
            >
              logout
            </motion.button>
          )}
          </AnimatePresence>
        </div>
        <div className="flex gap-4 text-lg text-bold font-bold font-serif">
          <button
            onClick={() => setTab("team")}
            className={`${tab === "team" ? "text-white border-b-2" : "text-black"}`}
          >
            Team
          </button>
          <button
            onClick={() => setTab("personal")}
            className={`${tab === "personal" ? "text-white border-b-2" : "text-black"}`}
          >
            Personal
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {logout && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }} // Smooth exit transition
          >
            <motion.div
              className="bg-white text-black p-6 rounded shadow-md"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }} 
            >
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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="m-4">
        <AnimatePresence mode="wait">
          {tab === "team" && (
            <motion.div
              key="team"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Teamtask name={state.name} role={state.role} />
            </motion.div>
          )}
          {tab === "personal" && (
            <motion.div
              key="personal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Personaltask />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Dashboard;
