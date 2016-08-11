import express     from 'express';
import passport    from 'passport';
import bcrypt      from 'bcrypt';
import Promise     from 'bluebird';
import AuthService from '../services/auth';
import RestUtils   from '../services/rest-utils';
// import db          from '../services/db-utils';
import tokenUtil   from '../services/token';
import ORM         from 'ormist';

const Strategy = require('passport-local').Strategy;
const router = express.Router();

bcrypt.compareAsync = Promise.promisify(bcrypt.compare);


passport.use(new Strategy(
  function(email, password, cb) {
    console.log("SELECT * FROM user WHERE email = '" + email + "'");
    console.log(ORM.db);
    ORM.db.getConnection().query("SELECT * FROM user WHERE email = '" + email + "'")
    .then(function(users) {
      var user = users[0];
      console.log(user, user.password);
      if (!user) { return cb(null, false); }
      // if (user.password != password) { return cb(null, false); }
      // return cb(null, user);
      return bcrypt.compareAsync(password, user.password)
      .then(function(res) {
        if(!res) return cb(null, false);
        return cb(null, user);
      });
    })
    .catch(cb);
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
  console.log(req.body);
  return AuthService.register(req.body)
  // .then(converter)
  .then(function(users) {
    res.json({ data: users });
  })
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
  if (!req.session.passport) return res.status(401).send('Unauthorized');
  res.json({ user: req.session.passport.user });
});

module.exports = router;
