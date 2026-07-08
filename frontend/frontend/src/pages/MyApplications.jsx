import { useEffect, useState } from "react";
import axios from "axios";

function MyApplications() {

  const [applications, setApplications] = useState([]);

  useEffect(() => {

    axios
      .get("http://localhost:8080/api/applications/user/1")
      .then((response) => {
        setApplications(response.data);
      })
      .catch((error) => {
        console.error(error);
      });

  }, []);

  return (
    <div className="container mt-4">

      <h2>My Applications</h2>

      {applications.length === 0 ? (
        <p>No applications found.</p>
      ) : (
        applications.map((application) => (
          <div
            key={application.id}
            className="card p-3 mb-3"
          >
            <h4>Job ID : {application.jobId}</h4>

            <p>
              <b>Status :</b> {application.status}
            </p>

            <p>
              <b>Resume :</b> {application.resumeFileName || "Not Uploaded"}
            </p>

          </div>
        ))
      )}

    </div>
  );
}

export default MyApplications;