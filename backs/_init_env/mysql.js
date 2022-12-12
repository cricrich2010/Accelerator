const my = require('mysql2');

console.log(process.env.SQL_CNX)
let dbcon_data = {
    host: "localhost",
    database: "MyAccelerator",
    port: 3020,
    user: "root",
    password: process.env.SQL_CNX
};


let cnxSql = my.createConnection(dbcon_data);
console.log("MySQL is wonderfull")

//////const myp = require('mysql2/promise');
//////let cnxSqp = new myp.PromiseConnection(dbcon_data);
//////const pool = myp.createPool({connectionLimit: 10, ...dbcon_data}); 

//////module.exports.mypool = pool;
//////module.exports.cnxSqp = cnxSqp;

// console.log(cnxSql)
// console.log('cnxSqlcnxSqlcnxSqlcnxSqlcnxSqlcnxSql') ,
// console.log(cnxSqp)
// console.log('objcet myp',Object.keys(myp))
// console.log('object cnxSqp',Object.keys(cnxSqp))

module.exports.cnxSql = cnxSql;



