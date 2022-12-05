const { cnxSql } = require('../_init_env/mysql.js');




function investigatorsRoutes(expressApp) {
    expressApp.post('/trialpatientadd', user_Login)
    expressApp.get('/trialpatients', New_User)
    expressApp.post('/trialpatientaddnote', New_Passwd)
    expressApp.post('/trialinvestigatorsubscribe', New_Passwd)
}

module.exports.investigatorsRoutes = investigatorsRoutes