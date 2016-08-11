import express from 'express';


const router = express.Router();

router.get('/', function (req, res) {
  db.getConnection().query('SELECT * FROM user')
  .then(RestUtils.DbRowsToJSON('user'))
  .then(function(users) {
    res.json({ data: users });
  })
  .catch(function(err) {
    console.log('Error', err);
  });
});

router.get('/:id', function (req, res) {
  db.getConnection().query('SELECT * FROM user WHERE id = ' + req.params.id)
  .then(RestUtils.DbRowsToJSON('user'))
  .then(function(users) {
    res.json({ data: users[0] });
  })
  .catch(function(err) {
    console.log('Error', err);
  });
});

module.exports = router;
