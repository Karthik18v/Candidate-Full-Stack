import React, { useEffect, useState } from "react";
import { CiFilter } from "react-icons/ci";
import { MdNavigateBefore, MdNavigateNext } from "react-icons/md";
import "./App.css";

function App() {
  const [candidates, setCandidates] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [gender, setGender] = useState("");
  const [minExperience, setMinExperience] = useState(0);
  const [maxExperience, setMaxExperience] = useState(100);
  const [skills, setSkills] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const allSkills = ["JavaScript", "React", "Node.js", "Python", "CSS", "HTML"];

  useEffect(() => {
    const fetchCandidates = async () => {
      setLoading(true); // Start loading
      try {
        const minExp =
          isNaN(minExperience) || minExperience === ""
            ? undefined
            : Number(minExperience);
        const maxExp =
          isNaN(maxExperience) || maxExperience === ""
            ? undefined
            : Number(maxExperience);

        const skillQuery = skills.join(",");
        const url = `https://candidate-full-stack.onrender.com/candidates?search=${search}&gender=${gender}&minExperience=${minExp}&maxExperience=${maxExp}&skills=${skillQuery}&page=${page}&limit=10`;

        const res = await fetch(url);
        const data = await res.json();

        setCandidates(data.data || []); // Ensure candidates data is an array
        setTotalPages(data.totalPages || 1);
      } catch (err) {
        console.error("Error fetching candidates:", err);
        setCandidates([]);
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchCandidates();
  }, [page, search, gender, minExperience, maxExperience, skills]);

  const handleSkillToggle = (skill) => {
    setSkills((prevSkills) =>
      prevSkills.includes(skill)
        ? prevSkills.filter((s) => s !== skill)
        : [...prevSkills, skill]
    );
    setPage(1); // Reset to first page when skills filter changes
  };

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  const handleAddCandidate = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newCandidate = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      gender: formData.get("gender"),
      experience: formData.get("experience"),
      skills: formData.getAll("skills"),
    };

    try {
      const response = await fetch(
        "https://candidate-full-stack.onrender.com/candidates",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newCandidate),
        }
      );

      if (response.ok) {
        setShowPopup(false); // Close the popup after adding the candidate
        setPage(1); // Reload the first page of candidates
      } else {
        alert("Error adding candidate");
      }
    } catch (error) {
      console.error("Error adding candidate:", error);
    }
  };

  return (
    <div className="main">
      <div className="header">
        <h1>Candidates</h1>
        <div className="filter-box">
          <input
            type="text"
            placeholder="Search by name, phone, or email"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1); // Reset to first page when search changes
            }}
            className="search-input"
          />

          <div className="pagination">
            <p>
              {page}/{totalPages}
            </p>
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
            >
              <MdNavigateBefore />
            </button>
            <button
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
            >
              <MdNavigateNext />
            </button>
          </div>

          <button onClick={() => setShowFilter((prev) => !prev)}>
            <CiFilter />
          </button>
        </div>
      </div>
      <button onClick={togglePopup} className="add-btn">
        Add Candidate
      </button>

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
            <form className="popup-form" onSubmit={handleAddCandidate}>
              <input
                name="name"
                type="text"
                placeholder="Full Name"
                className="input-field"
              />
              <input
                name="email"
                type="email"
                placeholder="Email"
                className="input-field"
              />
              <input
                name="phone"
                type="tel"
                placeholder="Phone Number"
                className="input-field"
              />
              <select name="gender" className="input-field">
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              <input
                name="experience"
                type="number"
                placeholder="Experience (in years)"
                className="input-field"
              />
              <div className="skills-section">
                <label>Skills</label>
                <div>
                  {allSkills.map((skill) => (
                    <div key={skill} className="skill-checkbox">
                      <input type="checkbox" name="skills" value={skill} />
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
