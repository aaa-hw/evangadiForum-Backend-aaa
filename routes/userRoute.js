const express =require('express');
const { register, login, checkUser } = require('../controller/userController');
const router = express.Router()
const dbConnection = require("../db/dbConfig");
const bcrypt = require("bcrypt");
const { StatusCodes } = require("http-status-codes");
const authMiddleware = require('../middleware/authMiddleware')


// register route 
router.post('/register', register)

// login route 
router.post('/login', login)

// check user  
router.get('/check', authMiddleware,checkUser)


module.exports = router