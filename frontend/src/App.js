import React, { useEffect, useState } from "react";
import { CiFilter } from "react-icons/ci";
import { MdNavigateBefore, MdNavigateNext } from "react-icons/md";
import "./App.css";

function App() {
  const [candidates, setCandidates] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [gender, setGender] = useState(""); // used in filter
  const [minExperience, setMinExperience] = useState(0);
  const [maxExperience, setMaxExperience] = useState(10);
  const [skills, setSkills] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "Male",
    experience: "",
    skills: [],
  });

  const allSkills = ["JavaScript", "React", "Node.js", "Python", "CSS", "HTML"];

  const fetchCandidates = async () => {
    setLoading(true);
    try {
      const skillQuery = skills.join(",");
      const url = `https://candidate-full-stack.onrender.com/candidates?search=${search}&gender=${gender}&minExperience=${minExperience}&maxExperience=${maxExperience}&skills=${skillQuery}&page=${page}&limit=10`;

      const res = await fetch(url);
      const data = await res.json();
      setCandidates(data.data || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error("Error fetching candidates:", err);
      setCandidates([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, [page, search, gender, minExperience, maxExperience, skills]);

  const handleSkillToggle = (skill) => {
    setSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
    setPage(1);
  };

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "skills") {
      setFormData((prev) => ({
        ...prev,
        skills: checked
          ? [...prev.skills, value]
          : prev.skills.filter((s) => s !== value),
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        "https://candidate-full-stack.onrender.com/candidates",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (!res.ok) throw new Error("Failed to add candidate");

      //const data = await res.json();
      alert("Candidate added successfully");
      setShowPopup(false);
      setFormData({
        name: "",
        email: "",
        phone: "",
        gender: "Male",
        experience: "",
        skills: [],
      });
      fetchCandidates(); // Refresh list
    } catch (err) {
      console.error(err);
      alert("Error adding candidate");
    }
  };

  return (
    <div className="main">
      <div className="header">
        <h1>Candidates</h1>
        <div>
          <button onClick={togglePopup} className="add-btn">
            Add
          </button>

          <div className="pagination">
            <input
              type="text"
              placeholder="Search by name, phone, or email"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="search-input"
            />
            <p>
              {page}/{totalPages}
            </p>
            <button onClick={() => setPage((prev) => Math.max(prev - 1, 1))}>
              <MdNavigateBefore />
            </button>
            <button
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            >
              <MdNavigateNext />
            </button>

            <button onClick={() => setShowFilter((prev) => !prev)}>
              <CiFilter />
            </button>
          </div>
        </div>
      </div>

      {showFilter && (
        <div className="filter-items">
          <p>Filter</p>
          <hr />
          <p>Experience</p>
          <input
            className="experience-input"
            type="number"
            placeholder="min"
            value={minExperience}
            onChange={(e) => setMinExperience(e.target.value)}
          />
          to
          <input
            className="experience-input"
            type="number"
            placeholder="max"
            value={maxExperience}
            onChange={(e) => setMaxExperience(e.target.value)}
          />
          <p>Skills</p>
          {allSkills.map((skill) => (
            <div key={skill} className="skill-checkbox">
              <input
                type="checkbox"
                checked={skills.includes(skill)}
                onChange={() => handleSkillToggle(skill)}
              />
              <label>{skill}</label>
            </div>
          ))}
        </div>
      )}

      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Gender</th>
            <th>Experience</th>
            <th>Skills</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="6" style={{ textAlign: "center" }}>
                Loading...
              </td>
            </tr>
          ) : candidates.length > 0 ? (
            candidates.map((c) => (
              <tr key={c._id}>
                <td>{c.name}</td>
                <td>{c.email}</td>
                <td>{c.phone}</td>
                <td>{c.gender}</td>
                <td>{c.experience}</td>
                <td>{c.skills.join(", ")}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" style={{ textAlign: "center" }}>
                No candidates found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <button className="close-btn" onClick={togglePopup}>
              ×
            </button>
            <h2>Add Candidate</h2>
            <form className="popup-form" onSubmit={handleFormSubmit}>
              <input
                type="text"
                name="name"
                value={formData.name}
                placeholder="Full Name"
                className="input-field"
                onChange={handleFormChange}
                required
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                placeholder="Email"
                className="input-field"
                onChange={handleFormChange}
                required
              />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                placeholder="Phone Number"
                className="input-field"
                onChange={handleFormChange}
                required
              />
              <select
                name="gender"
                value={formData.gender}
                onChange={handleFormChange}
                className="input-field"
              >
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
              <input
                type="number"
                name="experience"
                value={formData.experience}
                placeholder="Experience (years)"
                className="input-field"
                onChange={handleFormChange}
                required
              />
              <div className="skills-section">
                <label>Skills</label>
                <div className="skills-checkbox-group">
                  {allSkills.map((skill) => (
                    <div key={skill} className="skill-checkbox">
                      <input
                        type="checkbox"
                        name="skills"
                        value={skill}
                        checked={formData.skills.includes(skill)}
                        onChange={handleFormChange}
                      />
                      <label>{skill}</label>
                    </div>
                  ))}
                </div>
              </div>
              <button type="submit" className="submit-btn">
                Add Candidate
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
