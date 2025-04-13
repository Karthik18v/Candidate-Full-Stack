const express = require("express");
const router = express.Router();
const Candidate = require("../models/Candidate");

// Create a candidate
router.post("/", async (req, res) => {
  try {
    const candidate = new Candidate(req.body);
    await candidate.save();
    res
      .status(201)
      .json({ message: "Candidate created successfully", candidate });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get candidates with search, pagination, and filters
router.get("/", async (req, res) => {
  try {
    const {
      search = "",
      page = 1,
      limit = 10,
      gender,
      skills,
      minExperience,
      maxExperience,
    } = req.query;

    const query = {};

    // Search by name, phone, or email
    if (search) {
      query.$or = [
        { name: new RegExp(search, "i") },
        { phone: new RegExp(search, "i") },
        { email: new RegExp(search, "i") },
      ];
    }

    // Filter by gender
    if (gender) {
      query.gender = gender;
    }

    // Filter by skills
    if (skills) {
      const skillArray = skills.split(",").map((s) => s.trim());
      query.skills = { $all: skillArray };
    }

    // Filter by experience
    if (minExperience !== undefined || maxExperience !== undefined) {
      query.experience = {};
      if (minExperience !== undefined && !isNaN(minExperience)) {
        query.experience.$gte = parseInt(minExperience);
      }
      if (maxExperience !== undefined && !isNaN(maxExperience)) {
        query.experience.$lte = parseInt(maxExperience);
      }
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const candidates = await Candidate.find(query)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Candidate.countDocuments(query);

    res.json({
      data: candidates,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      totalCandidates: total,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
