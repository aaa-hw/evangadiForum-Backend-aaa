const { StatusCodes } = require("http-status-codes");
const dbConnection = require("../db/dbConfig");
const crypto = require("crypto");

// Post a new question
async function postQuestion(req, res) {
    const { userid, title, description, tag } = req.body;

    // Validate inputs
    if (!userid || !title || !description) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: "All fields are required" });
    }

    // Generate a unique question ID using crypto
    const questionid = crypto.randomBytes(10).toString("hex");

    // Get the current time and adjust it to UTC+3 hours
    const currentTimestamp = new Date();
    const adjustedDate = new Date(currentTimestamp.getTime() + 3 * 60 * 60 * 1000);
    const formattedTimestamp = adjustedDate.toISOString().slice(0, 19).replace("T", " ");

    try {
        // Insert the question into the database
        await dbConnection.query(
            "INSERT INTO questions (questionid, userid, title, description, tag, createdAt) VALUES (?, ?, ?, ?, ?, ?)",
            [questionid, userid, title, description, tag, formattedTimestamp]
        );
        return res.status(StatusCodes.CREATED).json({ message: "Question posted successfully" });
    } catch (err) {
        console.log(err);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong, please try again later" });
    }
}

// Get all questions with their details
async function getAllQuestions(req, res) {
    try {
        const [questions] = await dbConnection.query(`
            SELECT q.questionid, q.title, q.description, q.createdAt, u.username
            FROM questions q
            INNER JOIN users u ON q.userid = u.userid
            ORDER BY q.createdAt DESC
        `);
        return res.status(StatusCodes.OK).json({ questions });
    } catch (err) {
        console.log(err);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong, please try again later" });
    }
}

// Get a single question with its answers
async function getQuestionAndAnswer(req, res) {
    const questionid = req.params.questionId;

    try {
        const [rows] = await dbConnection.query(`
            SELECT 
                q.questionid, q.title, q.description, q.createdAt AS question_createdAt, 
                u2.username AS question_username, a.answerid, a.userid AS answer_userid, 
                a.answer, a.createdAt, u.username AS answer_username
            FROM questions q
            LEFT JOIN answers a ON q.questionid = a.questionid
            LEFT JOIN users u ON u.userid = a.userid
            LEFT JOIN users u2 ON u2.userid = q.userid
            WHERE q.questionid = ?
            ORDER BY a.createdAt DESC
        `, [questionid]);

        // If the question does not exist
        if (rows.length === 0) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: "Question not found" });
        }

        const questionDetails = {
            id: rows[0].questionid,
            title: rows[0].title,
            description: rows[0].description,
            qtn_createdAt: rows[0].question_createdAt,
            qtn_username: rows[0].question_username,
            answers: rows.map(answer => ({
                answerid: answer.answerid,
                userid: answer.answer_userid,
                username: answer.answer_username,
                answer: answer.answer,
                createdAt: answer.createdAt
            })).filter(answer => answer.answerid !== null)
        };

        res.status(StatusCodes.OK).json(questionDetails);
    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Error fetching question details" });
    }
}

module.exports = { postQuestion, getAllQuestions, getQuestionAndAnswer };
