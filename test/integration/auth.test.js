import Promise from 'bluebird';
import chai    from 'chai';
import request from 'supertest-as-promised';
import server  from '../../server';
import ORM     from 'ormist';
import chain   from 'store-chain';

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

/**
 * Should be tested:
 *  - Register:
 *      - Happy path
 *      - Happy path but wrong email confirmation
 *      - Invalid/empty params
 *  - Login:
 *  - Logout
 *  - Passlost
 */

function registerUser() {
  let user;
  let token;
  return api('post', '/auth/register', 200, userAttrs)
    .then(res => {
      res.body.should.have.property('data');
      return res.body.data.id;
    })
    .then(id => ORM.getModels().user.read(id))
    .then(_user => {
      user = _user;
      user.status.should.eql('new');
    })
    .then(() => ORM.getModels().token.latest())
    .then(_token => {
      token = _token;
      token.userId.should.eql(user.id);
      token.used.should.eql(0);
    })
    // Query on /auth/status should be OK
    .then(() => api('get', '/auth/status', 200))
    .then(() => ({ user, token }));
}

function confirmEmail(tokenValue, expectedHttpStatus, expextedUserStatus, expectedTokenStatus) {
  return chain(api('post', '/auth/confirm-email', expectedHttpStatus, { token: tokenValue }))
    .then(() => ORM.getModels().user.latest())
    .set('user')
    .then(() => ORM.getModels().token.latest())
    .set('token')
    .get(({ user, token }) => {
      user.status.should.equal(expextedUserStatus);
      token.used.should.eql(expectedTokenStatus);
    })
}

describe('Auth backend test', () => {

  it('POST /auth/register (OK) then confirm email (OK)', () =>
    registerUser()
    .then(({ user, token }) => confirmEmail(token.value, 200, 'confirmed', 1))
  );

  it('POST /auth/register (OK) then confirm email (KO bad token)', () =>
    registerUser()
    .then(({ user, token }) => confirmEmail(token.value + 'xyz', 400, 'new', 0))
  );

  it('POST /auth/register (OK) then confirm email (KO token expired)', () =>
    registerUser()
    .then(({ user, token }) => ORM.getModels().token.update(token.id, { createdAt: '2016-08-15' }))
    .then(token => confirmEmail(token.value, 400, 'new', 0))
  );



  it.skip('POST /auth/login (OK)', () =>
    api('post', '/auth/login', 200, {
      email: userAttrs.email,
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