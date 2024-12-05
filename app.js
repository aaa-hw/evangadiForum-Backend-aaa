require ("dotenv").config();

const express = require('express');
const app = express();
const port =process.env.PORT || 5500 ;

// db Connection
const dbConnection = require("./db/dbConfig")

const cors = require('cors');
// json middleware to extract json datan
app.use(express.json())
app.use(cors())



// user routes middleware file 
const userRoutes =require ("./routes/userRoute")

// question routes middleware file
const questionRoutes = require("./routes/questionRoute")

// answer routes middleware file
const answerRoutes = require("./routes/answerRoute");

// authentication middleware file
const authMiddleware = require("./middleware/authMiddleware")



// user routes middleware
app.use("/api/users",userRoutes)
  
// questions routes middleware
app.use("/api/questions",authMiddleware,questionRoutes)


// Answer routes (protected by authMiddleware)
app.use("/api/answers", authMiddleware, answerRoutes);


// Test route for checking server is working
app.get("/", (req, res) => {
    res.status(200).send("Welcome to Evangadi Forum");
  });

async function start() {
    try {
        const result = await dbConnection.execute("select 'test' ")
        await app.listen(port)
        console.log("database connection established");
        console.log(`Listening on ${port}`);
    } catch (error) {
        console.log(error.message)
    }
}
start()





