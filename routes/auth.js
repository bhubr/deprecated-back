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
    const query = "SELECT * FROM user WHERE email = '" + email + "'";
    ORM.db.getConnection().query(query)
    .then(function(users) {
      var user = users[0];
      if (!user) { return cb(null, false); }
      return bcrypt.compareAsync(password, user.password)
      .then(function(res) {
        if(!res) return cb(null, false);
        return cb(null, user);
      })
      .catch(err => { console.log('\n\n\n###### Error ######', err);  });
    })
    .then(cb)
    .catch(cb);
}));

passport.serializeUser(function(user, cb) {
  // console.log('serializeUser', user);
  cb(null, Object.assign({}, user));
});

passport.deserializeUser(function(user, cb) {
  // console.log('deserializeUser', user);
  cb(null, user);
});


/**
 * register route
 */
router.post('/register', (req, res) => {
  return chain(AuthService.register(Object.assign({}, req.body)))
  .set('user')
  .then(() => new Promise((resolve, reject) => {
    return (passport.authenticate('local'))(req, res, resolve);
  }))
  .get(({ user }) => res.json({ data: user }))
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
    delete req.session.passport.user.password;
    res.json({ user: req.session.passport.user });
  }
);

function passError(code) {
  return function(err) {
    console.log('### passError', err, code);
    throw err + ' ' + code;
  };
}
/**
 * Confirm email
 */
router.post('/confirm-email', (req, res) => {
  const Token = ORM.getModels().token;
  const User = ORM.getModels().user;
  const tokenValue = req.body.token;
  chain(Token.readAll("WHERE value = '" + tokenValue + "' AND used = 0"))
  .then(tokens => {
    if (tokens.length === 0) throw new Error('Token:NotFound');
    console.log('### TOKEN', tokens[0]); return tokens[0];
  })
  .set('token')
  .then(token => {
    // TODO: check token is still valid
    const diffTime = new Date().getTime() - token.createdAt.getTime();
    console.log('######### diffTime', new Date(), token.createdAt);
    const diffMinutes = Math.ceil(diffTime / (1000 * 60));
    console.log('######### diffMinutes', diffMinutes);
    if (diffMinutes >= token.validity) throw new Error('Token:Expired');
    return Token.update(token.id, { used: 1 });
  })
  .then(token => User.update(token.userId, { status: 'confirmed' }))
  .then(token => res.status(200).json({ token: token }))
  .catch(err => {
    console.log('### Error', err, err.stack);
    res.status(400).json({ success: false, message: err.message });
  })
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
