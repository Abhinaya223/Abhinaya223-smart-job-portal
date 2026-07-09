import { useEffect, useState } from "react";
import axios from "axios";

function Profile() {

  const [user, setUser] = useState({
    name: "",
    email: "",
    role: "",
    password: ""
  });

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/users/1")
      .then((response) => {
        setUser(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value
    });
  };

  const updateProfile = () => {
    axios
      .put("http://localhost:8080/api/users/1", user)
      .then(() => {
        alert("Profile Updated Successfully!");
      })
      .catch((error) => {
        console.error(error);
        alert("Update Failed!");
      });
  };

  return (
    <div className="container mt-4">

      <h2>My Profile</h2>

      <input
        className="form-control mb-2"
        name="name"
        value={user.name}
        onChange={handleChange}
        placeholder="Name"
      />

      <input
        className="form-control mb-2"
        name="email"
        value={user.email}
        onChange={handleChange}
        placeholder="Email"
      />

      <input
        className="form-control mb-2"
        name="role"
        value={user.role}
        readOnly
      />

      <input
        className="form-control mb-3"
        type="password"
        name="password"
        value={user.password}
        onChange={handleChange}
        placeholder="New Password"
      />

      <button
        className="btn btn-primary"
        onClick={updateProfile}
      >
        Update Profile
      </button>

    </div>
  );
}

export default Profile;