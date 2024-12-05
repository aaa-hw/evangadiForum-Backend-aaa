

const dbConnection = require("../db/dbConfig");
const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid"); // Function to submit a question

const submitQuestion = async (req, res) => {
  try {
    const { title, description, userid } = req.body;

    // Generate a UUID for questionid
    const questionid = uuidv4(); // Generates a unique UUID

    const newQuestion = await dbConnection.query(
      "INSERT INTO questions (title, description, questionid, userid) VALUES (?, ?, ?, ?)",
      [title, description, questionid, userid]
    );

    res.status(201).json(newQuestion);
  } catch (error) {
    console.error("Error submitting question:", error);
    res.status(400).json({ msg:"null question" });
  }
};
const getAllQuestions = async (req, res) => {
  const sql = `SELECT users.userid, users.username, questions.title,questions.questionid, questions.description FROM users JOIN questions ON users.userid = questions.userid;`;
  const result = await dbConnection.query(sql);
  res.json(result[0]);
};

const getSingleQuestion = async (req, res) => {
  try {
    const { questionid } = req.params;

    const sql = `
      SELECT users.username, questions.title, questions.questionid, questions.description 
      FROM users 
      JOIN questions ON users.userid = questions.userid 
      WHERE questions.questionid = ?;
    `;

    const [result] = await dbConnection.query(sql, [questionid]);

    if (result.length === 0) {
      return res.status(404).json({ message: "Question not found." });
    }

    res.json(result[0]);
  } catch (error) {
    console.error("Error fetching question:", error);
    res.status(500).json({ error: error.message });
  }
};
// Route to submit a question
router.post("/askquestion", submitQuestion);

// Route to get all questions
router.get("/getallquestions", getAllQuestions);

// Route to get a single question by id
router.get("/questions/:questionid", getSingleQuestion);

module.exports = router;




