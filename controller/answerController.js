

const dbConnection = require("../db/dbConfig");
const { StatusCodes } = require("http-status-codes");
// const uuidv4 = require('uuid').v4;

const answerForQuestion = async function (req, res) {
  const { questionid } = req.params; // Get the question_id from request parameters

  const response = await dbConnection.query(
    "select users.username, answers.answer from users join answers on answers.userid= users.userid where answers.questionid = ?",
    [questionid]
  );

  res.status(200).json(response[0]);
  // console.log(response)
};

// Post an answer to a question
const postAnswer = async function (req, res) {
  const { userid, questionid, answer } = req.body;

  // Validate answer input
  if (!answer) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      err: "Bad Request",
      msg: "Please provide an answer.",
    });
  }

  if (!userid) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      err: "Unauthorized",
      msg: "User not authenticated.",
    });
  }

  try {
    // const answerid = uuidv4();

    await dbConnection.query(
      `
        INSERT INTO answers ( questionid, userid, answer)
        VALUES (?, ?, ?)
    `,
      [questionid, userid, answer]
    );

    res.status(StatusCodes.CREATED).json({
      msg: "Answer posted successfully.",
    });
  } catch (err) {
    console.error("Error posting answer:", err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      err: err.message,
      msg: "An unexpected error occurred.",
    });
  }
};

module.exports = { answerForQuestion, postAnswer };
