import express from 'express';
import passport from 'passport';
const Strategy = require('passport-local').Strategy;
const router = express.Router();

// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
  console.log('Time: ', Date.now());
  next();
});

// define the register route
router.post('/register', function(req, res) {
  const converter = RestUtils.DbRowsToJSON('user');
  console.log(req.body);
  return AuthService.register(connection, req.body)
  .then(converter)
  .then(function(users) {
    res.json({ data: users });
  })
  .catch(function(err) {
    console.log('Error', err);
  });
});

// define the login route
router.post('/login',
  passport.authenticate('local'),
  function(req, res) {
    console.log('auth/login route');
    console.log(req.body);
    console.log(req.session);
    delete req.session.passport.user.password;
    res.json({ user: req.session.passport.user });
  }
);

// define the status route
router.get('/status', function (req, res) {
  if (!req.session.passport) return res.status(401).send('Unauthorized');
  res.json({ user: req.session.passport.user });
});

module.exports = router;
