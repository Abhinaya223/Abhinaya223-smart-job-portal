import { useEffect, useState } from "react";
import axios from "axios";

function RecruiterDashboard() {

  const [applications, setApplications] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/applications")
      .then((response) => {
        setApplications(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const updateStatus = (id, action) => {
    axios
      .put(`http://localhost:8080/api/applications/${id}/${action}`)
      .then(() => {
        alert(`Application ${action}ed successfully`);

        setApplications((prev) =>
          prev.map((app) =>
            app.id === id
              ? { ...app, status: action === "accept" ? "Accepted" : "Rejected" }
              : app
          )
        );
      })
      .catch((error) => {
        console.error(error);
        alert("Operation Failed!");
      });
  };

  return (
    <div className="container mt-4">
      <h2>Recruiter Dashboard</h2>

      {applications.length === 0 ? (
        <p>No applications available.</p>
      ) : (
        applications.map((app) => (
          <div key={app.id} className="card p-3 mb-3">

            <h4>Application ID: {app.id}</h4>

            <p><b>Job ID:</b> {app.jobId}</p>

            <p><b>User ID:</b> {app.userId}</p>

            <p><b>Status:</b> {app.status}</p>

            <button
              className="btn btn-success me-2"
              onClick={() => updateStatus(app.id, "accept")}
            >
              Accept
            </button>

            <button
              className="btn btn-danger"
              onClick={() => updateStatus(app.id, "reject")}
            >
              Reject
            </button>

          </div>
        ))
      )}
    </div>
  );
}

export default RecruiterDashboard;