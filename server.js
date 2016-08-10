import Promise     from 'bluebird';
import bcrypt      from 'bcrypt';
import db          from './services/db-utils';
import RestUtils   from './services/rest-utils';
import express     from 'express';
import passport    from 'passport';

var pluralize  = require('pluralize')
var _          = require('lodash');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session    = require('express-session')

var Strategy   = require('passport-local').Strategy;
var config     = require(__dirname + '/config.json');
var app        = express();


bcrypt.compareAsync = Promise.promisify(bcrypt.compare);

db.init(config.db);

app.use(cookieParser());
app.use(bodyParser.json({ type: 'application/*+json' }))  // Ember adapter uses vnd.api+json
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








app.get('/users', function (req, res) {
  db.getConnection().query('SELECT * FROM user')
  .then(RestUtils.DbRowsToJSON('user'))
  .then(function(users) {
    res.json({ data: users });
  })
  .catch(function(err) {
    console.log('Error', err);
  });
});

app.get('/users/:id', function (req, res) {
  db.getConnection().query('SELECT * FROM user WHERE id = ' + req.params.id)
  .then(RestUtils.DbRowsToJSON('user'))
  .then(function(users) {
    res.json({ data: users[0] });
  })
  .catch(function(err) {
    console.log('Error', err);
  });
});


app.get('/activities', function(req, res) {
  db.getConnection().query('SELECT name,slug,color FROM activity')
  .then(function(rows, fields) {
    // if (err) throw err;

    res.json(rows[0]);
  })
  .catch(function(err) {
    console.log('Error', err);
  });

});

app.use('/auth', require('./routes/auth'));

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});