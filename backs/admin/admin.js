const { cnxSql } = require('../_init_env/mysql.js');




function wizardRoutes(expressApp) {
    expressApp.post('/wizard', user_Login)
    expressApp.get('/trilainvestigators', New_User)
    expressApp.post('/acceptinvestigator', New_Passwd)
}

module.exports.wizardRoutes = wizardRoutes