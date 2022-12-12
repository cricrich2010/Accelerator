const my = require('mysql2');

console.log(process.env.SQL_CNX)
let dbcon_data = {
    host: "localhost",
    database: "MyAccelerator",
    port: 3021,
    user: "root",
    password: process.env.SQL_CNX
};

let cnxSql = my.createConnection(dbcon_data);
console.log("wonderfull")

module.exports.cnxSql = cnxSql;



