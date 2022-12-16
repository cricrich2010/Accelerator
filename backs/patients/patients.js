const { cnxSql } = require('../_init_env/mysql.js');


function patienthistory(req, res) {

}
function patientaddnote(req, res) {

}

function Routes(expressApp) {
    expressApp.get('/patienthistory', patienthistory)
    expressApp.post('/patientaddnote', patientaddnote)

}

module.exports.Routes = Routes
