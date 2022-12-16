const { cnxSql } = require('../_init_env/mysql.js');

const qTrialInf =
    "SELECT *  " +
    "FROM Trials  " +
    "INNER JOIN Subscriptions ON trials.trialcode = Subscriptions.trialcode   " +
    "INNER JOIN Accounts ON Subscriptions.login=Accounts.login  " +
    "WHERE Subscriptions.role='ctm' and Trials.trialcode = ?;"

const qTrialInv =
    "SELECT Accounts.login as login, " +
    "Accounts.email as invEmail, " +
    "Roles.status as invStatus " +
    "FROM Trials  " +
    "INNER JOIN Subscriptions ON trials.trialcode = Subscriptions.trialcode    " +
    "INNER JOIN Roles ON  Subscriptions.login=Roles.login and Subscriptions.role=Roles.role " +
    "INNER JOIN Accounts ON Roles.login=Accounts.login " +
    "WHERE Subscriptions.role='investigator' and Not Roles.status='requested' and Trials.trialcode = ?; "

const qTrialInvPending =
    "SELECT Accounts.login as login, " +
    "Accounts.email as invEmail, " +
    "Roles.status as invStatus " +
    "FROM Trials " +
    "INNER JOIN Subscriptions ON trials.trialcode = Subscriptions.trialcode " +
    "INNER JOIN Roles ON  Subscriptions.login=Roles.login and Subscriptions.role=Roles.role " +
    "INNER JOIN Accounts ON Roles.login=Accounts.login " +
    "WHERE Subscriptions.role='investigator' and Roles.status='requested' and Trials.trialcode = ?;"

const qTrialPatients =
    "SELECT Accounts.login as login, " +
    "Accounts.email as invEmail " +
    "FROM Trials  " +
    "INNER JOIN Subscriptions ON trials.trialcode = Subscriptions.trialcode    " +
    "INNER JOIN Roles ON  Subscriptions.login=Roles.login and Subscriptions.role=Roles.role " +
    "INNER JOIN Accounts ON Roles.login=Accounts.login " +
    "WHERE Subscriptions.role='patient' and Trials.trialcode = ?; "

function wtrialinfo(req, res) {
    //return lines info of site
    console.log("receive get wtrialinfo", req.query.trial)
    cnxSql.query(qTrialInf, [req.query.trial], (err, data) => {
        if (err) {
            console.log("err site-info query", err);
            res.status(500);
            res.send(err)
        }
        else {
            console.log(data);
            res.json(data)
        }
    });
}

function wtrialinvestigators(req, res) {
    //return trial investigators
    console.log("receive get tial investigators", req.query.trial)
    cnxSql.query(qTrialInv, [req.query.trial], (err, data) => {
        if (err) {
            console.log("err site-info query", err);
            res.status(500);
            res.send(err)
        }
        else {
            console.log(data);
            res.json(data)
        }
    });

}

function wtrialinvestigatorspending(req, res) {
    //return trial investigators
    console.log("receive get pending investigators", req.query.trial)
    cnxSql.query(qTrialInvPending, [req.query.trial], (err, data) => {
        if (err) {
            console.log("err site-info query", err);
            res.status(500);
            res.send(err)
        }
        else {
            console.log(data);
            res.json(data)
        }
    });

}

function wpatients(req, res) {
    //return trial investigators
    console.log("receive get trial patients", req.query.trial)
    cnxSql.query(qTrialPatients, [req.query.trial], (err, data) => {
        if (err) {
            console.log("err get trial patients", err);
            res.status(500);
            res.send(err)
        }
        else {
            console.log('get trial patients', data);
            res.json(data)
        }
    });

}

async function wNewTrial(req, res) {
    //check query fieldss
    //check line exist 
    console.log("receive New trial qury", req.body['trialcode'], req.body['description'])
    cnxSql.query('insert into Trials (trialcode, description) values (?,?) ; ',
        [req.body['trialcode'], req.body['description']], (err, data) => {
            if (err) {
                console.log("err add new trial query", err);
                res.status(500);
                res.send(err)
            }
            else {
                console.log('SUCCESS REC NEW TRIAL', data);
                res.status(200);
                res.send('SUCCESS REC NEW TRIAL')
            }
        });
}

async function wtrialpatients(req, res) {
    //check query fieldss
    //check line exist 
    console.log("receive get trial patient", req.query.trial)
    cnxSql.query(qTrialPatients, [req.query.trial], (err, data) => {
        if (err) {
            console.log("err  trial patient query", err);
            res.status(500);
            res.send(err)
        }
        else {
            console.log(data);

            res.json(data)
        }
    });
}



function Routes(expressApp) {
    expressApp.get('/wtrialinfo', wtrialinfo)
    //expressApp.post('/wizard', wizard)
    expressApp.post('/wNewTrial', wNewTrial)
    expressApp.post('/wtrialpatients', wtrialpatients)
    expressApp.get('/wtrialinvestigators', wtrialinvestigators)
    expressApp.get('/wpatients', wpatients)
    expressApp.get('/wtrialinvestigatorspending', wtrialinvestigatorspending)

    //expressApp.post('/acceptinvestigator', New_Passwd)
}

module.exports.Routes = Routes