const { cnxSql } = require('../_init_env/mysql.js');



function Routes(expressApp) {
    expressApp.get('/patienthistory', user_Login)
    expressApp.post('/patientaddnote', New_User)

}

module.exports.Routes = Routes