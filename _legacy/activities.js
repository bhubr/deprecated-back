import express from 'express';


const router = express.Router();

router.get('/', function(req, res) {
  db.getConnection().query('SELECT name,slug,color FROM activity')
  .then(function(rows, fields) {
    // if (err) throw err;

    res.json(rows[0]);
  })
  .catch(function(err) {
    console.log('Error', err);
  });

});
module.exports = router;
