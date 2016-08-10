import express     from 'express';
import Promise     from 'bluebird';
import ORM         from '../services/orm';
import tokenUtil   from '../services/token';

const router = express.Router();

// define the register route
router.get('/create-token', (req, res) => {

  const Token = ORM.getModels().token;
  Token.create({
    value: tokenUtil.gen(32),
    validity: 60,
    userId: 1,
    usageFor: 'auth:confirm-email'
  })
  .then(token => res.json({ token }));
});

module.exports = router;
