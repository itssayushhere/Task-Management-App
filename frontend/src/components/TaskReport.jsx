// components/TaskReport.js
import { useState } from "react";

const TaskReport = ({allUsers}) => {
    const Users = [{_id:"",name:"All"},...allUsers]
  const [status, setStatus] = useState("");
  const [assignedUser, setAssignedUser] = useState("");
  const [format, setFormat] = useState("json"); // Default to JSON
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTaskReport = async (filters) => {
    const { status, assignedUser, format } = filters;
    const API_URL = `${import.meta.env.VITE_BASEURL}/task/report`; // Adjust the URL as necessary

    const queryParams = new URLSearchParams();
    if (status) queryParams.append("status", status);
    if (assignedUser) queryParams.append("assignedUser", assignedUser);
    if (format) queryParams.append("format", format);
    console.log(queryParams.toString());
    const response = await fetch(`${API_URL}?${queryParams.toString()}`);
    if (!response.ok) {
      throw new Error("Failed to fetch report");
    }

    return response[format === "csv" ? "blob" : "json"]();
  };
  const handleGenerateReport = async () => {
    setLoading(true);
    setError(null);
  
    try {
      const report = await fetchTaskReport({ status, assignedUser, format });
      let content;
      if (format === "csv") {
        content = report; 
      } else {
        content = JSON.stringify(report, null, 2); 
      }
  
      const blob = new Blob([content], { type: format === "csv" ? "text/csv" : "application/json" });
      
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement("a");
      link.href = url;
      
      link.setAttribute("download", `tasks_report.${format}`);
      
      document.body.appendChild(link);
      link.click();      
      link.remove();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  

  return (
    <div className="bg-black p-4 rounded-lg shadow-lg text-white mt-7">
      <h2 className="text-xl font-bold mb-4">Generate Task Report</h2>
      <div className="mt-2">
        <label className="block mb-2">
          Status:
          <div className="mt-2">
            <label className="inline-flex items-center mr-4">
              <input
                type="radio"
                value=""
                checked={status === ""}
                onChange={(e) => setStatus(e.target.value)}
                className="form-radio text-purple-600"
              />
              <span className="ml-2">All</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                value="To Do"
                checked={status === "To Do"}
                onChange={(e) => setStatus(e.target.value)}
                className="form-radio text-purple-600"
              />
              <span className="ml-2">To Do</span>
            </label>
            <label className="inline-flex items-center ml-4">
              <input
                type="radio"
                value="In Progress"
                checked={status === "In Progress"}
                onChange={(e) => setStatus(e.target.value)}
                className="form-radio text-purple-600"
              />
              <span className="ml-2">Progress</span>
            </label>
            <label className="inline-flex items-center ml-4">
              <input
                type="radio"
                value="Completed"
                checked={status === "Completed"}
                onChange={(e) => setStatus(e.target.value)}
                className="form-radio text-purple-600"
              />
              <span className="ml-2">Completed</span>
            </label>
          </div>
        </label>

        <label className="block mb-2">
          User:
          <select
            type="text"
            value={assignedUser}
            onChange={(e) => setAssignedUser(e.target.value)}
            className="border border-gray-600 p-2 rounded w-full text-black"
          >
            {Users.map((item,index)=>
            <option key={index} value={`${item._id}`}>{item.name}</option>
            )}
          </select>
        </label>
        <label className="block mb-2">
          Format:
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value)}
            className="border border-gray-600 p-2 rounded w-full text-black"
          >
            <option value="json">JSON</option>
            <option value="csv">CSV</option>
          </select>
        </label>
        <button
          onClick={handleGenerateReport}
          className="bg-blue-600 text-white p-2 rounded w-full hover:bg-blue-500 transition duration-200"
        >
          {loading ? "Generating..." : "Generate Report"}
        </button>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>
    </div>
  );
};

export default TaskReport;
