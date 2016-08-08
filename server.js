var Promise    = require('bluebird');
var express    = require('express');
var mysql      = require('promise-mysql');
var pluralize  = require('pluralize')
var _          = require('lodash');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session    = require('express-session')
var bcrypt     = require('bcrypt');
var passport   = require('passport');
var Strategy   = require('passport-local').Strategy;
var config     = require(__dirname + '/config.json');
var app        = express();
var saltRounds = 10;
// Instantiate Chance so it can be used
// var Chance     = require('chance');
// var chance     = new Chance();
var connection;

bcrypt.hashAsync = Promise.promisify(bcrypt.hash);
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

function processRow(row) {
  var output = {}
  for (k in row) {
    if (k === 'id') continue;
    var dashed = k.replace('_', '-');
    output[dashed] = row[k];
  }
  return output;
}

function processRowReverse(row) {
  var output = {}
  for (k in row) {
    if (k === 'id') continue;
    var dashed = k.replace('_', '-');
    output[dashed] = row[k];
  }
  return output;
}

function genericReadHandler(tableName) {
  return function(rows) {
    var plural = pluralize(tableName);
    return _.map(rows, function(row) {
      return {
        type: plural,
        id: row.id,
        attributes: processRow(row)
      }
    });
  }
}

passport.use(new Strategy(
  function(username, password, cb) {
    console.log("SELECT * FROM user WHERE user_name = '" + username + "'");
    connection.query("SELECT * FROM user WHERE user_name = '" + username + "'")
    // db.users.findByUsername(username, function(err, user) {
    .then(function(users) {
      // if (err) { return cb(err); }
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
  .then(genericReadHandler('user'))
  .then(function(users) {
    res.json({ data: users });
  })
  .catch(function(err) {
    console.log('Error', err);
  });
});

app.get('/users/:id', function (req, res) {
  connection.query('SELECT * FROM user WHERE id = ' + req.params.id)
  .then(genericReadHandler('user'))
  .then(function(users) {
    res.json({ data: users[0] });
  })
  .catch(function(err) {
    console.log('Error', err);
  });
});



app.post('/users', bodyParser.json(), function(req, res) {
  var rawAttrs = processRowReverse(req.body.data.attributes);
  var rawPass = rawAttrs.password;
  delete rawAttrs.password;
  var userAttrs = _.values(rawAttrs);
  bcrypt.hashAsync(rawPass, saltRounds)
  .then(function(hash) {
    userAttrs.push(hash);
    var quotedAttrs = _.map(userAttrs, function(attr) {
      return "'" + attr + "'";
    })
    var values = quotedAttrs.join(',');
    var query = 'INSERT INTO user(user_name,first_name,last_name,birth_date,password) VALUES(' + values + ')';
    console.log(query);
    connection.query(query)
    .then(function(entry) {
      connection.query('SELECT * FROM user WHERE id=' + entry.insertId)
        .then(genericReadHandler('user'))
        .then(function(users) {
          res.json({ data: users });
        })
        .catch(function(err) {
          console.log('Error', err);
        });
    })
    .catch(errHandler);
  })
  .catch(function(err) {
    console.log('Err occured while encrypting pass:', err);
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