const mysql2 = require('mysql2');
require('dotenv').config();

const dbConnection = mysql2.createPool({
    user:process.env.USER,
    database:process.env.DATABASE,
    host:process.env.HOST,
    password:process.env.PASSWORD,
    connectionLimit: 10,
    port: process.env.PORT,
})




// dbConnection.execute("select 'test' ",(err, result)=>{
//     if(err){
//         console.log(err.message);
//     }else{
//         console.log(result);
//     }
// })

module.exports = dbConnection.promise()