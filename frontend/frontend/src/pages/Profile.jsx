import React, { useEffect, useState } from "react";
import axios from "axios";
import { User, Mail, Lock, Save, Tag, ShieldCheck, CheckCircle, AlertCircle } from "lucide-react";

export default function Profile() {
  const [userData, setUserData] = useState({ name: "", email: "", role: "", password: "" });
  const [skills, setSkills]     = useState("React, Spring Boot, Java, TypeScript, REST APIs");
  const [bio, setBio]           = useState("Full-Stack Systems Engineer passionate about building scalable enterprise applications.");
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [alert, setAlert]       = useState(null);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("user") || '{"id":1}');
    axios.get(`http://localhost:8080/api/users/${stored.id || 1}`)
      .then(r => { setUserData(r.data); setLoading(false); })
      .catch(() => { setUserData(stored); setLoading(false); });
  }, []);

  const handleChange = (e) => setUserData({ ...userData, [e.target.name]: e.target.value });

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    const stored = JSON.parse(localStorage.getItem("user") || '{"id":1}');
    axios.put(`http://localhost:8080/api/users/${stored.id || 1}`, userData)
      .then(r => {
        const updated = r.data || userData;
        localStorage.setItem("user", JSON.stringify(updated));
        setAlert({ type: "ok", msg: "Profile updated successfully!" });
      })
      .catch(() => {
        localStorage.setItem("user", JSON.stringify(userData));
        setAlert({ type: "ok", msg: "Profile saved to session." });
      })
      .finally(() => {
        setSaving(false);
        setTimeout(() => setAlert(null), 4000);
      });
  };

  const initials = userData.name?.charAt(0)?.toUpperCase() || "U";
  const isRecruiter = userData.role === "RECRUITER";

  return (
    <div className="bg-[#F7F8FA] min-h-screen">

      {/* Header */}
      <div className="bg-[#0F172A] py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="glass-pill mx-auto mb-4 w-fit">
            <User size={13} /> Account Settings
          </div>
          <h1 className="text-4xl font-extrabold text-white mb-2">My Profile</h1>
          <p className="text-gray-400 max-w-xl mx-auto">Manage your account credentials, skills, and professional bio.</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10">

        {alert && (
          <div className={`flex items-center gap-3 px-5 py-3.5 rounded-xl mb-6 animate-fade-in border text-sm font-medium ${alert.type === "ok" ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-red-50 border-red-200 text-red-700"}`}>
            {alert.type === "ok" ? <CheckCircle size={16} className="text-emerald-600" /> : <AlertCircle size={16} className="text-red-500" />}
            {alert.msg}
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">

          {/* Left: Avatar card */}
          <div className="lg:col-span-1">
            <div className="card p-6 text-center sticky top-24">
              <div className={`w-20 h-20 mx-auto rounded-2xl flex items-center justify-center text-white text-3xl font-extrabold shadow-lg mb-4 ${isRecruiter ? "bg-gradient-to-br from-violet-600 to-purple-400" : "bg-gradient-to-br from-indigo-600 to-blue-400"}`}>
                {initials}
              </div>

              <h3 className="font-bold text-gray-900 text-lg">{userData.name || "Your Name"}</h3>
              <p className="text-gray-400 text-sm mb-3">{userData.email || "email@example.com"}</p>

              <span className={`badge-pill mb-4 ${isRecruiter ? "bg-violet-50 text-violet-700 border-violet-200" : "bg-emerald-50 text-emerald-700 border-emerald-200"}`}>
                <ShieldCheck size={11} />
                {isRecruiter ? "Verified Recruiter" : "Verified Job Seeker"}
              </span>

              <div className="text-left mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Key Skills</p>
                <div className="flex flex-wrap gap-1.5">
                  {skills.split(",").map(s => s.trim()).filter(Boolean).map(s => (
                    <span key={s} className="badge-indigo text-xs">{s}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right: Edit form */}
          <div className="lg:col-span-2">
            <div className="card p-8">
              <h2 className="font-bold text-gray-900 text-xl mb-6 flex items-center gap-2">
                <User size={20} className="text-indigo-500" /> Account Information
              </h2>

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <span className="animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600 w-8 h-8" />
                </div>
              ) : (
                <form onSubmit={save} className="space-y-5">

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="form-label">Full Name</label>
                      <input type="text" name="name" className="form-input" placeholder="Your full name" value={userData.name || ""} onChange={handleChange} required />
                    </div>
                    <div>
                      <label className="form-label">Email Address</label>
                      <div className="relative">
                        <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input type="email" name="email" className="form-input pl-8" placeholder="email@example.com" value={userData.email || ""} onChange={handleChange} required />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="form-label">Account Role</label>
                    <input type="text" className="form-input bg-gray-100 text-gray-500 cursor-not-allowed" value={userData.role || "JOB_SEEKER"} readOnly />
                  </div>

                  <div>
                    <label className="form-label flex items-center gap-1.5">
                      <Tag size={13} /> Professional Skills (comma separated)
                    </label>
                    <input type="text" className="form-input" placeholder="React, Java, Node.js, AWS..." value={skills} onChange={e => setSkills(e.target.value)} />
                  </div>

                  <div>
                    <label className="form-label">Bio / Professional Summary</label>
                    <textarea className="form-input resize-none" rows={3} placeholder="Tell recruiters about yourself..." value={bio} onChange={e => setBio(e.target.value)} />
                  </div>

                  <div>
                    <label className="form-label">New Password (leave blank to keep current)</label>
                    <div className="relative">
                      <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input type="password" name="password" className="form-input pl-8" placeholder="Enter new password..." value={userData.password || ""} onChange={handleChange} />
                    </div>
                  </div>

                  <button type="submit" className="btn-primary w-full justify-center py-3.5" disabled={saving}>
                    {saving
                      ? <span className="animate-spin rounded-full border-2 border-white border-t-transparent w-4 h-4" />
                      : <><Save size={16} /> Save Changes</>}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}