const Buffer = require('safe-buffer').Buffer;
const { notStrictEqual } = require('assert');
const Crypto = require('crypto');
const uuid = require('uuid');
const { cnxSql } = require('../_init_env/mysql.js');
const seed = "Password hash seed";
// const Auth   = exports;

let wizard_date = new Date();
//add 1 year to date
wizard_date.setTime(wizard_date.getTime() + 365 * 24 * 60 * 60 * 1000);
//Token dic, lits patern. The list allow to filter out the expried items
// dic : key: ref to lit item
// list: [ { Token, accountlogin, expire, role } ]
let validTokenList = [{ token: "wizard", accountlogin: "wizard", expire: wizard_date, role: 'wizard' }]
let validTokenDic = {}
validTokenDic[validTokenList[0].token] = 0
console.log(validTokenList)
console.log(validTokenList[0])
console.log(validTokenDic)

// need timer to remove expired token
/*   setInterval(() => {
    const dateNow = new Date()
    validTokenList = validTokenList.filter( it => it.expire > dateNow )
  },15*60*1000) */


// Check if user is authenticated, and set headers accordingly
function user_Auth(req, res, next) {
  console.log('req.get(AuthToken)', req.get('AuthToken'))
  //has the request an AuthToken
  if (!(req.get('AuthToken'))) {
    req['authenticated'] = false;
    req['role'] = 'any';
    console.log('user_Auth, no token:', req.authenticated)
    // req.set('authenticated', false)
    return next();
  }
  //is token a valid token
  if (req.get('AuthToken') in validTokenDic) {
    const reqAuthToken = validTokenList[validTokenDic[req.get('AuthToken')]]
    console.log('print user token', reqAuthToken.expire, new Date())
    if (reqAuthToken.expire > new Date()) {
      req['authenticated'] = true;
      req['accountlogin'] = reqAuthToken.accountlogin
      req['role'] = reqAuthToken.role;
      console.log('user_Auth, valid token:', req.authenticated)
      // req.set('authenticated', true);
      return next();
    } else {
      delete validTokenDic[req.get('AuthToken')] //as the list index is used in the Dic, can't clean the list witout heavy load process. need better Idea
      req['authenticated'] = false;
      req['role'] = 'any';
      console.log('user_Auth, token expired:', req.authenticated)
      // req.set('authenticated', false)
      return next();
    }
  } else {
    req['authenticated'] = false;
    req['role'] = 'any';
    console.log('user_Auth, invalid token:', req.authenticated)
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
  //if (!(req.body['accountlogin'] && req.body['Auth'])) {
  if (!('accountlogin' in req.body || 'Auth' in req.body)) {
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

function generateAuthTokenHold(req, res, role) {
  // generate and return token
  let UserUuid = uuid.uuidv1().toString('hex')
  // add token to valid list
  let Nowdate = Date()
  Nowdate += (2 * 60 * 1000) // add 2 mins
  validTokenList.push({ token: UserUuid, accountlogin: req.body['accountlogin'], expire: Nowdate, role: role })
  res.status(200).json({ 'AuthToken': UserUuid });
}

function generateAuthToken(req, res) {

  //get user role
  cnxSql.cnxSql.query('select login, role from Roles where login = ?', [req.body['accountlogin']], (err, UserAuth) => {
    if (err) {
      console.log(err)
      res.status(500).statusMessage = err
      res.end()
    } else {
      // generate and return token
      console.log('in generateAuthToken', UserAuth)
      let UserUuid = uuid.uuidv1().toString('hex')
      // add token to valid list
      let Nowdate = Date()
      Nowdate += (2 * 60 * 1000) // add 2 mins
      validTokenList.push({ token: UserUuid, accountlogin: req.body['accountlogin'], expire: Nowdate, role: UserAuth[0].role })
      res.status(200).json({ 'AuthToken': UserUuid });
    }
  })
}



function user_Login(req, res) {
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
      // empty passwd is always valid -->> this is a student project !!!!
      console.log('UserAuth[0].Auth', UserAuth[0].Auth)
      if (UserAuth[0].password === "" || UserAuth[0].Auth === null) {
        // generate and return token
        generateAuthToken(req, res)
        return;
      }
      // check password
      let hash = Crypto.pbkdf2Sync(req.body['Auth'], seed, 1000, 64, `sha512`).toString(`hex`);
      if (UserAuth[0].password === hash) {
        // password ok, generate and return token
        generateAuthToken(req, res)
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

  //check user exist 
  let UserAuth = await cnxSql.cnxSqp.query('select password form Accounts where login = ?', [req.body['accountlogin']])
  console.log(UserAuth)
  // user must not exist
  if (UserAuth.length = 1) {
    res.status(403).statusMessage = 'user creation failled: user already exist';
    res.end()
    return;
  }
  // checkemail
  if (!('accountemail' in req.body)) { req.body['accountemail'] = "no email" }
  //create user
  let hash = Crypto.pbkdf2Sync(req.body['Auth'], this.seed, 1000, 64, `sha512`).toString(`hex`);
  UserAuth = await cnxSql.cnxSqp.query('insert INTO Accounts (login, email, password) values (?,?,?)', [req.body['accountlogin'], req.body['accountemail'], hash])
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


function New_Passwd(req, res) {
  //check query fields
  if (!user_consistency(req, res)) { return; }
  let hash = "";
  // hash pass if any
  if (!(req.body['Auth'] === "")) { hash = Crypto.pbkdf2Sync(req.body['Auth'], this.seed, 1000, 64, `sha512`).toString(`hex`); }
  // rec new passwd
  cnxSql.cnxSql.query('UPDATE Accounts SET password = ? where login = ?;', [hash, req.body['accountlogin']], (err, sqldata) => {
    if (err) {
      console.log(err)
      res.status(500).statusMessage = err
      res.end()
    } else {
      res.status(200).statusMessage = 'New password saved'
      res.end()
    }
  })
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
