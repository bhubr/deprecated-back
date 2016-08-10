import Promise   from 'bluebird';
import bcrypt    from 'bcrypt';
import auth      from './services/auth';
import RestUtils from './services/rest-utils';

var express    = require('express');
var mysql      = require('promise-mysql');
var pluralize  = require('pluralize')
var _          = require('lodash');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session    = require('express-session')

var passport   = require('passport');
var Strategy   = require('passport-local').Strategy;
var config     = require(__dirname + '/config.json');
var app        = express();

var saltRounds = 10;
// Instantiate Chance so it can be used
// var Chance     = require('chance');
// var chance     = new Chance();
var connection;


bcrypt.compareAsync = Promise.promisify(bcrypt.compare);

mysql.createConnection(config.db).then(function(conn){
    connection = conn;
});

app.use(cookieParser());
// parse various different custom JSON types as JSON
// Ember REST adapter uses bloody vnd.api+json, fuck it
app.use(bodyParser.json({ type: 'application/*+json' }))
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: config.secureCookies }
}))
app.use(passport.initialize());
app.use(passport.session());

function errHandler(err) {
  console.log('** Error **');
  console.log(err);
}




passport.use(new Strategy(
  function(email, password, cb) {
    console.log("SELECT * FROM user WHERE email = '" + email + "'");
    connection.query("SELECT * FROM user WHERE email = '" + email + "'")
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
  // console.log('deserializeUser #1', id);
  // // db.users.findById(id, function (err, user) {
  // connection.query("SELECT * FROM user WHERE id = " + id)
  // .then(function(users) {
  //   var user = users[0];
  //   console.log('deserializeUser #2', user);
  //   if (err) { return cb(err); }
    cb(null, user);
  // });
});

app.get('/users', function (req, res) {
  connection.query('SELECT * FROM user')
  .then(RestUtils.DbRowsToJSON('user'))
  .then(function(users) {
    res.json({ data: users });
  })
  .catch(function(err) {
    console.log('Error', err);
  });
});

app.get('/users/:id', function (req, res) {
  connection.query('SELECT * FROM user WHERE id = ' + req.params.id)
  .then(RestUtils.DbRowsToJSON('user'))
  .then(function(users) {
    res.json({ data: users[0] });
  })
  .catch(function(err) {
    console.log('Error', err);
  });
});


app.post('/auth/register', function(req, res) {
  const converter = RestUtils.DbRowsToJSON('user');
  console.log(req.body);
  return auth.register(connection, req.body)
  .then(converter)
  .then(function(users) {
    res.json({ data: users });
  })
  .catch(function(err) {
    console.log('Error', err);
  });
});

app.post('/auth/login',
  passport.authenticate('local'),
  function(req, res) {
    console.log('auth/login route');
    console.log(req.body);
    console.log(req.session);
    delete req.session.passport.user.password;
    res.json({ user: req.session.passport.user });
  }
);

app.get('/auth/status', function (req, res) {
  if (!req.session.passport) return res.status(401).send('Unauthorized');
  res.json({ user: req.session.passport.user });
});


app.get('/activities', function(req, res) {
  connection.query('SELECT name,slug,color FROM activity')
  .then(function(rows, fields) {
    // if (err) throw err;

    res.json(rows[0]);
  })
  .catch(function(err) {
    console.log('Error', err);
  });

});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});