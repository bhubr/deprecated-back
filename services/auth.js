/**
 * Auth service
 */
import Promise   from 'bluebird';
import bcrypt    from 'bcrypt';
import chain     from 'store-chain';
import RestUtils from './rest-utils';
import DbUtils   from './db-utils';
import tokenUtil from './token';
import ORM       from './orm';
import event     from './event-hub';
import mailgun   from './mailgun';

bcrypt.hashAsync = Promise.promisify(bcrypt.hash);

const User = ORM.getModels().user;
const Token = ORM.getModels().token;

function register(attributes) {

  // # of salt iterations
  const saltRounds = 10;

  // Get password from attributes
  const plainTextPassword = attributes.password;

  // Generate a hash
  return bcrypt.hashAsync(plainTextPassword, saltRounds)
  .then(hashedPassword => {
    attributes.password = hashedPassword;
    return chain(User.create(attributes))
    .set('user')
    .then(user => Token.create({
      value: tokenUtil.gen(32),
      validity: 60,
      userId: user.id,
      usageFor: 'auth:confirm-email'
    }))
    .set('token')
    .get(({ user, token }) => {
      console.log(user, token);
      const link = 'http://localhost:4200/auth/confirm-email?token=' + token.value;
      // event.hub().on('user:register', mailgun.sendEmail);
      event.hub().emit('user:register', { user, token, link });
      console.log('event emitted, return', user);
      return user;
    })
    .catch(err => { console.log(err); });
  })
  .catch(function(err) {
    console.log('Err occured while encrypting pass:', err);
  });

}

export default {
	register
}