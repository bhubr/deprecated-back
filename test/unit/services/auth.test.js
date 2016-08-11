import Promise from 'bluebird';
import auth from '../../../services/auth';
import chai from 'chai';
import config from '../../../config';
const should = chai.should();

function getId() {
  return new Date().getTime().toString(36);
}
describe('Auth service', () => {

  it('register', () => {
    const userAttrs = {
      email: 'benoithubert+' + getId() + '@gmail.com',
      firstName: 'Toto',
      lastName: 'Tau',
      password: 'SecurePass123$$'
    };
    return auth.register(userAttrs)
    .then(console.log);
  });

});