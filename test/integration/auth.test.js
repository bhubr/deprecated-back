import Promise from 'bluebird';
import chai    from 'chai';
import request from 'supertest-as-promised';
import server  from '../../server';
import ORM     from 'ormist';

const should = chai.should();
const agent = request.agent(server);

function getId() {
  return (new Date().getTime() + 1000000 * Math.random()).toString(36);
}

function api(method, url, expectedStatus, data) {
  const _agent = agent[method](url);
  if (method === 'get' || method === 'post') {
    _agent.set('Content-Type', 'application/vnd.api+json')
    .send(data);
  }
  return _agent
  .expect(expectedStatus)
  .expect('Content-Type', /json/);
}

const userAttrs = {
  email: 'benoithubert+' + getId() + '@gmail.com',
  "first-name": 'Toto',
  "last-name": 'Tau',
  password: 'SecurePass123$$'
};

describe('Auth backend test', () => {

  it('POST /auth/register (OK)', () =>
    api('post', '/auth/register', 200, userAttrs)
    .then(res => {
      res.body.should.have.property('data');
      console.log('\n## res.body.data', res.body.data);
      return res.body.data.id;
    })
    .then(id => ORM.getModels().user.read(id))
    .then(user => {
      // user.status.should.eql()
    })
    .catch(err => {
      console.log(err);
      throw err;
    })
  );

  it.skip('POST /auth/login (OK)', () =>
    api('post', '/auth/login', 200, {
      username: userAttrs.email,
      password: userAttrs.password
    })
    .then(res => {
      res.body.should.have.property('user');
    })
    // Query on /auth/status should be OK
    .then(() => api('get', '/auth/status', 200))
    .catch(err => {
      console.log(err);
      throw err;
    })
  );

  it.skip('POST /auth/logout (OK)', () =>
    api('post', '/auth/logout', 200, {})
    .then(res => {
      res.body.success.should.eql(true);
    })
    // Query on /auth/status should send Unauthorized
    .then(() => api('get', '/auth/status', 401))
    .catch(err => {
      console.log(err);
      throw err;
    })
  );

});