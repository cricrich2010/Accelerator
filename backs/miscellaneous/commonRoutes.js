const { cnxSql } = require('../_init_env/mysql.js');

async function rootRoute(req, res) {
    console.log("receive get: /")
    let data = { message: "Welcome to the trial accelerator" }
    res.json(data)
}

async function trialsRoute(req, res) {
    //return Trilas list according user role and sbscription
    console.log("receive get: site/list")
    if (req.authenticated && req.role == "investigator") {

    }
    cnxSql.query("select * from Trials;", (err, data) => {
        if (err) {
            console.log("err Trialsquery query", err);
            res.status(500);
            res.send(err)
        }
        else {
            // et si j'ai besoin d'un jeu de données suplémentaire ??????
            // cnxSql.query("select * from Trilas;", (err, data) => {

            console.log(data);
            res.json(data)
        }
    });

}

function Routes(expressApp) {
    expressApp.get('/', rootRoute)
    expressApp.get('/trilas', trialsRoute)

}

module.exports.Routes = Routes