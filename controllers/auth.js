import chain from 'store-chain';
import AuthService from '../services/auth';

function postRegister(req, res) {
  console.log(req.body);
  return chain(AuthService.register(Object.assign({}, req.body)))
  .set('user')
  .then(() => new Promise((resolve, reject) => {
    return (passport.authenticate('local'))(req, res, resolve);
  }))
  .get(({ user }) => res.json({ data: user }))
  .catch(function(err) {
    console.log(err.stack);
    res.status(500).send('500 Internal Error: ' + err.message);
  });
}

export default {
  postRegister
}