const { cnxSql } = require('../_init_env/mysql.js');

function trialnew() {

}
function trilainvestigators() {

}
function acceptinvestigator() {

}

function Routes(expressApp) {
    expressApp.post('/trialnew', trialnew)
    expressApp.get('/trilainvestigators', trilainvestigators)
    expressApp.post('/acceptinvestigator', acceptinvestigator)
}

module.exports.Routes = Routes