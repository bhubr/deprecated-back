/**
 * Auth service
 */
import Promise   from 'bluebird';
import bcrypt    from 'bcrypt';
import chain     from 'store-chain';
import tokenUtil from './token';
import ORM       from 'ormist';
import event     from './event-hub';

bcrypt.hashAsync = Promise.promisify(bcrypt.hash);

function register(attributes) {
  const User = ORM.getModels().user;
  const Token = ORM.getModels().token;

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
      event.hub().emit('user:register', { user, token });
      return user;
    })
    .catch(err => { console.log(err); console.log(err.stack); throw err; });
  });
  // .catch(function(err) {
    // console.log('Err occured while encrypting pass:', err);
    // console.log(err.stack);
  // });

}

export default {
	register
}