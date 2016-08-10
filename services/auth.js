/**
 * Auth service
 */
import RestUtils from './rest-utils';
import Promise   from 'bluebird';
import bcrypt    from 'bcrypt';
import DbUtils   from './db-utils';
import event     from './event-hub';
import mailgun   from './mailgun';

bcrypt.hashAsync = Promise.promisify(bcrypt.hash);

function register(connection, attributes) {

  // # of salt iterations
  const saltRounds = 10;

  // Get password from attributes
  const plainTextPassword = attributes.password;

  // Generate a hash
  return bcrypt.hashAsync(plainTextPassword, saltRounds)
  .then(hashedPassword => {
    attributes.password = hashedPassword;
    const query = DbUtils.payloadToQuery('user', attributes);
    console.log('Register user query:', query);
    return connection.query(query)
    .then(function(entry) {
      return connection.query('SELECT * FROM user WHERE id=' + entry.insertId);
    })
    .then(users => {
      event.hub().on('user:register', mailgun.sendEmail);
      event.hub().emit('user:register', users[0]);
      return users;
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