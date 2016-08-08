var express    = require('express');
var mysql      = require('promise-mysql');
var Promise    = require('bluebird');
var app        = express();
var config     = require(__dirname + '/config.json');
var pluralize  = require('pluralize')
var _          = require('lodash');
var connection;
mysql.createConnection(config.db).then(function(conn){
    connection = conn;
});

function processRow(row) {
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
  connection.query('SELECT * from user')
  .then(genericReadHandler('user'))
  .then(function(users) {
    res.json({ data: users });
  })
  .catch(function(err) {
    console.log('Error', err);
  });

  // var users = [
  //   {
  //     type: 'users',
  //     id: 1,
  //     attributes: {
  //       "first-name": 'Bernie',
  //       "last-name": 'Sanders',
  //       "birth-date": '1941-09-08'
  //     }
  //   },
  //   {
  //     type: 'users',
  //     id: 2,
  //     attributes: {
  //       "first-name": 'Hillary',
  //       "last-name": 'Clinton',
  //       "birth-date": '1947-10-26'
  //     }
  //   },
  //   {
  //     type: 'users',
  //     id: 3,
  //     attributes: {
  //       "first-name": 'Donald',
  //       "last-name": 'Trump',
  //       "birth-date": '1946-06-14'
  //     }
  //   },
  //   {
  //     type: 'users',
  //     id: 4,
  //     attributes: {
  //       "first-name": 'George',
  //       "last-name": 'Bush',
  //       "birth-date": '1924-06-12'
  //     }
  //   }
  // ];
  // var payload = {
  //   data: users
  // };
  // res.json(payload);
});

app.get('/activities', function(req, res) {
  connection.query('SELECT name,slug,color from activity')
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