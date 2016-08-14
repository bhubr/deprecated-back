import express     from 'express';
import passport    from 'passport';
import bcrypt      from 'bcrypt';
import Promise     from 'bluebird';
import chain       from 'store-chain';
import AuthService from '../services/auth';
import RestUtils   from '../services/rest-utils';
// import db          from '../services/db-utils';
import tokenUtil   from '../services/token';
import ORM         from 'ormist';

const Strategy = require('passport-local').Strategy;
const router = express.Router();

bcrypt.compareAsync = Promise.promisify(bcrypt.compare);


passport.use(new Strategy(
  { 
    usernameField: 'email'
  },
  function(email, password, cb) {
    // console.log("SELECT * FROM user WHERE email = '" + email + "'");
    // console.log(ORM.db);
    console.log('### Auth verify', email, password);
    // console.log(cb.toString());
    // console.log(ORM.db.getConnection());
    const query = "SELECT * FROM user WHERE email = '" + email + "'";
    ORM.db.getConnection().query(query)
    .then(result => { console.log('AFTER QUERY (then)', result); return result; })
    .catch(err => { console.log('AFTER QUERY (catch)', err); throw err; })
    .then(function(users) {
      console.log(users);
      var user = users[0];
      console.log(user, user.password);
      if (!user) { return cb(null, false); }
      return bcrypt.compareAsync(password, user.password)
      .then(function(res) {
        console.log('\n##### bcrypt compare result', arguments);
        if(!res) return cb(null, false);
        return cb(null, user);
      })
      .catch(err => { console.log('\n\n\n###### Error ######', err);  });
    })
    .then(() => { console.log('\n ##### SHOULD PRINT STH ###########'); cb(); })
    .catch(err => { console.log('\n\n\n###### Error ######', err); cb(err); });
}));

passport.serializeUser(function(user, cb) {
  console.log('serializeUser', user);
  cb(null, Object.assign({}, user));
});

passport.deserializeUser(function(user, cb) {
  console.log('deserializeUser', user);
  cb(null, user);
});


/**
 * register route
 */
router.post('/register', (req, res) => {
  // const converter = RestUtils.DbRowsToJSON('user');
  // console.log(req.body);
  console.log('\n#### Before register', req.body);
  return chain(AuthService.register(Object.assign({}, req.body)))
  .set('user')
  .then(() => { console.log('\n#### Before auth attempt', req.body); console.log('\n\n\n#######\n\n\n') })
  .then(() => ({ req, res }))
  // .then(() => (passport.authenticate('local'))(req, res, Promise.resolve))
  .then(({ req, res }) => new Promise((resolve, reject) => {
    return (passport.authenticate('local'))(req, res, resolve);
  }))
  .then(() => { console.log('\n\n\n#######\n\n\n') ; console.log('\n#### After auth attempt', req.session); })
  // .then(converter)
  .get(({ user }) => 
    res.json({ data: user })
  )
  .catch(function(err) {
    console.log(err.stack);
    res.status(500).send('500 Internal Error: ' + err.message);
  });
});


/**
 * login route
 */
router.post('/login',
  passport.authenticate('local'),
  (req, res) => {
    console.log('auth/login route');
    console.log(req.body);
    console.log(req.session);
    delete req.session.passport.user.password;
    res.json({ user: req.session.passport.user });
  }
);

/**
 * Confirm email
 */
router.post('/confirm-email', (req, res) => {
  const Token = ORM.getModels().token;
  const User = ORM.getModels().user;
  const tokenValue = req.body.token;
  chain(Token.readAll("WHERE value = '" + tokenValue + "'"))
  .then(tokens => { console.log('### TOKEN', tokens[0]); return tokens[0]; })
  .set('token')
  .then(token => {
    // TODO: check token is not used and still valid
    return Token.update(token.id, { used: 1 });
  })
  .then(token => User.update(token.userId, { status: 'confirmed' }))
  .then(token => res.status(200).json({ token: token }));
});



/**
 * logout route
 */
router.post('/logout', (req, res) => {
  req.session.destroy(function(err) {
    if (err) {
      return res.status(500).send('500 Internal Error: ' + err.message);
    }
    res.json({ success: true });
  });
});

router.post('/passlost', (req, res) => {
  const token = tokenUtil.gen();
});

// define the status route
router.get('/status', function (req, res) {
  console.log('\n\n### auth/status');
  if (!req.session.passport) return res.status(401).json({
    code: 401,
    message: 'Unauthorized'
  });
  res.json({ user: req.session.passport.user });
});

module.exports = router;
