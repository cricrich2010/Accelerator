const { cnxSql } = require('../_init_env/mysql.js');

const sInvSubsribed =
    "SELECT Trials.trialcode as Trial, " +
    "Trials.description as Description, " +
    "Subscribed.Suscribed as Suscribed " +
    "FROM Trials " +
    "LEFT JOIN  " +
    "(SELECT Subscriptions.trialcode as trialcode, " +
    "Subscriptions.login as Suscribed " +
    "FROM " +
    "(Accounts  " +
    "INNER JOIN Roles ON Roles.login=Accounts.login " +
    "INNER JOIN Subscriptions ON Subscriptions.login=Roles.login and Subscriptions.role=Roles.role) " +
    "WHERE Subscriptions.role='investigator' and (not Roles.status='requested') and Accounts.login = ?) as Subscribed " +
    "ON Trials.trialcode = Subscribed.trialcode; "




async function rootRoute(req, res) {
    console.log("receive get: /")
    let data = { message: "Welcome to the trial accelerator" }
    res.json(data)
}

async function trialsRoute(req, res) {
    //return Trilas list according user role and sbscription
    console.log("receive get: site/list")
    if (req.authenticated && req.role == "investigator") {
        cnxSql.query(sInvSubsribed, [req.accountlogin], (err, data) => {
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
    } else {
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
}

function Routes(expressApp) {
    expressApp.get('/', rootRoute)
    console.log('register /trialsRoute')

    expressApp.get('/trials', trialsRoute)

}

module.exports.Routes = Routes