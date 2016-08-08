var express = require('express');
var app = express();

app.get('/users', function (req, res) {
  var users = [
    {
      type: 'users',
      id: 1,
      attributes: {
        "first-name": 'Bernie',
        "last-name": 'Sanders',
        "birth-date": '1941-09-08'
      }
    },
    {
      type: 'users',
      id: 2,
      attributes: {
        "first-name": 'Hillary',
        "last-name": 'Clinton',
        "birth-date": '1947-10-26'
      }
    },
    {
      type: 'users',
      id: 3,
      attributes: {
        "first-name": 'Donald',
        "last-name": 'Trump',
        "birth-date": '1946-06-14'
      }
    },
    {
      type: 'users',
      id: 4,
      attributes: {
        "first-name": 'George',
        "last-name": 'Bush',
        "birth-date": '1924-06-12'
      }
    }
  ];
  var payload = {
    data: users
  };
  res.json(payload);
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});