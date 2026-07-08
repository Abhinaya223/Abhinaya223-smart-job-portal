import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PostJob from "./pages/PostJob";
//import ViewJobs from "./pages/ViewJobs";
import ViewJobs from "./pages/ViewJobs";
import MyApplications from "./pages/MyApplications";
import RecruiterDashboard from "./pages/RecruiterDashboard";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/my-applications" element={<MyApplications />} />
        
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/post-job" element={<PostJob />} />
        <Route path="/jobs" element={<ViewJobs />} />
        <Route path="/recruiter-dashboard" element={<RecruiterDashboard />}/>
        
      </Routes>

      <Footer />
    </>
  );
}

export default App;