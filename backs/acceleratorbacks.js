const { expressServ, startServ } = require('./_init_env/express.js');
// const { cnxSql } = require('./_init_env/dbutil.js');
const { user_Auth } = require('./authentication/Auth.js');
const { firewall } = require('./authentication/FireWall.js');

//console log the queries sreceived by the server
function queryInLog(req, res, next) {
    console.log('middleware new req::', 'url:', req.url, 'body:', req.body)
        ; next()
}

//middlewares
//  expressServ.use(express.static('./public')); ->> moved to _init_env
//  expressServ.use(express.json()); ->> moved to _init_env
expressServ.use(queryInLog);
expressServ.use(user_Auth); //check user is authenticated
expressServ.use(firewall); //check allowed user routes

//import routes
const { authRoutes } = require('./authentication/Auth.js');
authRoutes(expressServ)
const { patientsRoutes } = require('./patients/patients.js');
patientsRoutes(expressServ)
const { investigatorsRoutes } = require('./investigators/investigators.js');
investigatorsRoutes(expressServ)
const { ctmRoutes } = require('./ctm/ctm.js');
ctmRoutes(expressServ)



startServ(); // start server