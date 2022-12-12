const { cnxSql } = require('../_init_env/mysql.js');

async function rootRoute(req, res) {

}
async function TrialsRoute(req, res) {
    //return Trilas list according user role and sbscription


}

function Routes(expressApp) {
    expressApp.get('/', rootRoute)
    expressApp.post('/trilas', TrialsRoute)

}

module.exports.Routes = Routes