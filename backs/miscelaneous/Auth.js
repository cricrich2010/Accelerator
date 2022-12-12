const Buffer = require('safe-buffer').Buffer;
const Crypto = require('crypto');
const uuid = require('uuid');
const { cnxSql } = require('../_init_env/mysql.js');
const seed = "Password hash seed";
// const Auth   = exports;

let wizard_date = new Date();
//add 1 year to date
wizard_date.setTime(wizard_date.getTime() + 365 * 24 * 60 * 60 * 1000);
let validToken = { wizard: wizard_date }

//req.authenticated
// Check if user is authenticated, and set headers accordingly
function user_Auth(req, res, next) {
  //has the request an AuthToken
  if (!(req.get('AuthToken'))) {
    req['authenticated'] = false;
    console.log('user_Auth, no token:', res.authenticated)

    // req.set('authenticated', false)
    return next();
  }
  //is token a valid token
  if (req.get('AuthToken') in validToken) {
    if (validToken['AuthToken'][1] > Date()) {
      req['authenticated'] = true;
      console.log('user_Auth, valid token:', res.authenticated)
      // req.set('authenticated', true);
      return next();
    } else {
      delete validToken['AuthToken']
      req['authenticated'] = false;
      console.log('user_Auth, token expired:', res.authenticated)
      // req.set('authenticated', false)
      return next();
    }
  } else {
    req['authenticated'] = false;
    console.log('user_Auth, invalid token:', res.authenticated)
    // req.set('authenticated', false)
    return next();
  }
};


// // Method to check the entered password is correct or not 
// UserSchema.methods.validPassword = function(password) { 
//   let hash = Crypto.pbkdf2Sync(password, this.seed, 1000, 64, `sha512`).toString(`hex`); 
//   return this.hash === hash; 
// }; 


// check user concistency request, works for all user operation: login, new user, new pass 
function user_consistency(req, res) {
  //check query fields
  console.log(req.body)
  console.log(typeof (req.body))
  console.log(req.body['accountlogin'])
  console.log(req.body['Auth'])
  console.log(req.body['bidon'])

  if (!(req.body['accountlogin'] && req.body['Auth'])) {
    console.log("fields miss")
    res.status(403).statusMessage = 'Authentication failled: missing login and/or password';
    res.end()
    return false;
  }
  // check empty user
  if (req.body['accountlogin'] == "") {
    console.log("empty login")
    res.status(403).statusMessage = 'Authentication failled: missing login and/or password';
    res.end()
    return false;
  }
  console.log("user req consistent")

  return true
}

function GenerateToken(req, res) {
  // generate and return token
  let UserUuid = uuid.uuidv1().toString('hex')
  // add token to valid list
  let Nowdate = Date()
  Nowdate += (2 * 60 * 1000) // add 2 mins
  validToken.append([hash], [req.body['FirstName'], Nowdate])
  res.status(200).json({ 'AuthToken': UserUuid });
}

function cleanup_ValidToken() {
  // need timer to remove expred token
}


async function user_Login(req, res) {
  //check query fields
  if (!user_consistency(req, res)) { return; }

  //check user exist and pw is valid (db has no empty userlogin empty)
  cnxSql.cnxSql.query('select password, login from accounts where login = ?', [req.body['accountlogin']], (err, UserAuth) => {
    if (err) {
      console.log(err)
      res.status(500).statusMessage = err
      res.end()
    } else {

      console.log(UserAuth)
      console.log(UserAuth[0])
      console.log('UserAuth[0].Auth', UserAuth[0].Auth)

      // user must exist
      if (UserAuth.length == 0) {
        res.status(403).statusMessage = 'Authentication failled: missing login and/or password';
        res.end
        return;
      }
      // empty key is always valid -->> this is a student project !!!!
      console.log('UserAuth[0].Auth', UserAuth[0].Auth)
      if (UserAuth[0].Auth === "" || UserAuth[0].Auth === null) {
        // generate and return token
        let UserUuid = uuid.uuidv1().toString('hex')
        res.status(200).json({ 'AuthToken': UserUuid });
        return;
      }
      // check password
      let hash = Crypto.pbkdf2Sync(req.body['Auth'], seed, 1000, 64, `sha512`).toString(`hex`);
      if (UserAuth[0].Auth === hash) {
        // password ok, generate and return token
        let UserUuid = uuid.uuidv1().toString('hex')
        res.status(200).json({ 'AuthToken': UserUuid });
        return;
      }
      else {
        res.status(403).statusMessage = 'Authentication failled: wrong login and/or password';
        res.end()
        return;
      }
    }
  })
}

async function New_User(req, res) {
  //check query fields
  if (!user_consistency(req, res)) { return; }

  //check user exist and pw is valid (db has no empty userlogin empty)
  let UserAuth = await cnxSql.cnxSqp.query('select Auth form People where login = ?', [req.body['accountlogin']])
  console.log(UserAuth)
  // user must not exist
  if (UserAuth.length = 1) {
    res.status(403).statusMessage = 'user creation failled: user already exist';
    res.end()
    return;
  }

  //create user
  let hash = Crypto.pbkdf2Sync(req.body['Auth'], this.seed, 1000, 64, `sha512`).toString(`hex`);
  UserAuth = await cnxSql.cnxSqp.query('insert INTO accounts (login, email, password) values (?,?,?)', [req.body['accountlogin'], req.body['accountemail'], hash])
  UserAuth = await cnxSql.cnxSqp.query('insert INTO Roles (login, role, status) values (?,?,?)', [req.body['accountlogin'], 'investigator', 'requested'])

  // generate and return token
  let UserUuid = uuid.uuidv1().toString('hex')
  // add token to valid list
  let Nowdate = Date()
  Nowdate += (2 * 60 * 1000) // add 2 mins
  validToken[hash] = [req.body['accountlogin'], Nowdate, 'any']
  res.status(200).json({ 'AuthToken': UserUuid });
  return;

}


async function New_Passwd(req, res) {
  //check query fields
  if (!user_consistency(req, res)) { return; }
  let hash = "";
  // hash pass if any
  if (!(req.body['Auth'] === "")) { hash = Crypto.pbkdf2Sync(req.body['Auth'], this.seed, 1000, 64, `sha512`).toString(`hex`); }
  // rec new passwd
  let UserAuth = await cnxSql.cnxSql.query('UPDATE People SET Auth = ? where FirstName = ?;', [req.body['FirstName'], hash])


}

module.exports.user_Auth = user_Auth;
// module.exports.user_Login = user_Login;
// module.exports.New_User = New_User;
// module.exports.New_Passwd = New_Passwd;


function authRoutes(expressApp) {
  expressApp.post('/login', user_Login)
  expressApp.post('/new_user', New_User)
  expressApp.post('/new_passwd', New_Passwd)
}

module.exports.authRoutes = authRoutes
