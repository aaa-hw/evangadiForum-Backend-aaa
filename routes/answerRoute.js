
const express = require("express");
const router = express.Router();
const dbConnection = require("../db/dbConfig");

const {
  postAnswer,
  answerForQuestion,
} = require("../controller/answerController");

//answer route
router.post("/answerQuestion", postAnswer);

router.get("/getanswer/:questionid", answerForQuestion);

//export the route

module.exports = router;


