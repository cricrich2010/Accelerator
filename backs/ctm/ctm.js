const { cnxSql } = require('../_init_env/mysql.js');




function ctmRoutes(expressApp) {
    expressApp.post('/trialnew', user_Login)
    expressApp.get('/trilainvestigators', New_User)
    expressApp.post('/acceptinvestigator', New_Passwd)
}

module.exports.ctmRoutes = ctmRoutes