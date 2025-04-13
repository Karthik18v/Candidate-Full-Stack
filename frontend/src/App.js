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
  const [minExperience, setMinExperience] = useState("");
  const [maxExperience, setMaxExperience] = useState("");
  const [skills, setSkills] = useState([]);
  const [showFilter, setShowFilter] = useState(false);

  const allSkills = ["JavaScript", "React", "Node.js", "Python", "CSS", "HTML"];

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const skillQuery = skills.join(",");
        const url = `https://candidate-full-stack.onrender.com/candidates?search=${search}&gender=${gender}&minExperience=${minExperience}&maxExperience=${maxExperience}&skills=${skillQuery}&page=${page}&limit=10`;

        const res = await fetch(url);
        const data = await res.json();
        setCandidates(data.data);
        setTotalPages(data.totalPages);
      } catch (err) {
        console.error("Error fetching candidates:", err);
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
    setPage(1);
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
              setPage(1);
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

      {showFilter && (
        <div className="filter-items">
          <p>Filter</p>
          <hr />
          <p>Experience</p>
          <input className="experince-input" type="number" placeholder="min" />
          to
          <input className="experince-input" type="number" placeholder="max" />
          <p>Skills / Technologies</p>
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
          {candidates.map((c) => (
            <tr key={c._id}>
              <td>{c.name}</td>
              <td>{c.email}</td>
              <td>{c.phone}</td>
              <td>{c.gender}</td>
              <td>{c.experience}</td>
              <td>{c.skills.join(", ")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
