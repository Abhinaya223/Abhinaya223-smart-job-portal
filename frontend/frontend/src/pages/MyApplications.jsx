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

      <h2 className="text-center text-primary mb-4">
        My Applications
      </h2>

      <div className="row">

        {applications.length === 0 ? (

          <div className="text-center">
            <h5>No Applications Found</h5>
          </div>

        ) : (

          applications.map((application) => (

            <div className="col-md-6 mb-4" key={application.id}>

              <div className="card shadow h-100">

                <div className="card-body">

                  <h4 className="text-primary">
                    💼 Application #{application.id}
                  </h4>

                  <hr />

                  <p>
                    <strong>🆔 Job ID:</strong> {application.jobId}
                  </p>

                  <p>
                    <strong>📌 Status:</strong> {application.status}
                  </p>

                  <p>
                    <strong>📄 Resume:</strong>{" "}
                    {application.resumeFileName || "Not Uploaded"}
                  </p>

                </div>

              </div>

            </div>

          ))

        )}

      </div>

    </div>
  );
}

export default MyApplications;