import Promise from 'bluebird';
import auth from '../../services/auth';
// import DB from '../../services/db-utils';
import chai from 'chai';
import config from '../../config';
import ORM from 'ormist';

const should = chai.should();

// DB.init(config.db);

// before(done => {
//   console.log('## test');
//   ORM.init(config.db.driver, config.db.settings)
//   .then(() => done);
// });


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