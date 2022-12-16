const { cnxSql } = require('../_init_env/mysql.js');

function trialpatientadd(req, res) {

}

function trialpatients(req, res) {

}

function trialpatientaddnote(req, res) {

}

function trialinvestigatorsubscribe(req, res) {

}


function Routes(expressApp) {
    expressApp.post('/trialpatientadd', trialpatientadd)
    expressApp.get('/trialpatients', trialpatients)
    expressApp.post('/trialpatientaddnote', trialpatientaddnote)
    expressApp.post('/trialinvestigatorsubscribe', trialinvestigatorsubscribe)
}

module.exports.Routes = Routes