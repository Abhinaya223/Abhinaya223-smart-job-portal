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
              ? {
                  ...app,
                  status: action === "accept" ? "Accepted" : "Rejected"
                }
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

      <h2 className="text-center text-primary mb-4">
        Recruiter Dashboard
      </h2>

      <div className="row">

        {applications.length === 0 ? (

          <div className="text-center">
            <h5>No Applications Available</h5>
          </div>

        ) : (

          applications.map((app) => (

            <div className="col-md-6 mb-4" key={app.id}>

              <div className="card shadow h-100">

                <div className="card-body">

                  <h4 className="text-primary">
                    📄 Application #{app.id}
                  </h4>

                  <hr />

                  <p>
                    <strong>💼 Job ID:</strong> {app.jobId}
                  </p>

                  <p>
                    <strong>👤 User ID:</strong> {app.userId}
                  </p>

                  <p>
                    <strong>📌 Status:</strong> {app.status}
                  </p>

                </div>

                <div className="card-footer bg-white border-0">

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

              </div>

            </div>

          ))

        )}

      </div>

    </div>
  );
}

export default RecruiterDashboard;