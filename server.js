var Promise    = require('bluebird');
var express    = require('express');
var mysql      = require('promise-mysql');
var pluralize  = require('pluralize')
var _          = require('lodash');
var bodyParser = require('body-parser');
var config     = require(__dirname + '/config.json');
var app        = express();

// Instantiate Chance so it can be used
var Chance     = require('chance');
var chance = new Chance();

var connection;
mysql.createConnection(config.db).then(function(conn){
    connection = conn;
});

// parse various different custom JSON types as JSON
// Ember REST adapter uses bloody vnd.api+json, fuck it
app.use(bodyParser.json({ type: 'application/*+json' }))

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

app.post('/users', bodyParser.json(), function(req, res) {
  // console.log(req.body);
  // var user = {
  //   firstName: chance.first(),
  //   lastName:  chance.last(),
  //   birthDate: (chance.birthday()).toISOString().substring(0, 10)
  // };
  var rawAttrs = processRowReverse(req.body.data.attributes);
  var userAttrs = _.values(rawAttrs);
  var quotedAttrs = _.map(userAttrs, function(attr) {
    return "'" + attr + "'";
  })
  var values = quotedAttrs.join(',');
  var query = 'INSERT INTO user(first_name,last_name,birth_date) VALUES(' + values + ')';
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