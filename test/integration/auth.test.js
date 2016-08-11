import Promise from 'bluebird';
import chai    from 'chai';
import request from 'supertest-as-promised';
import server from '../../server';

const should = chai.should();
const agent = request.agent(server);

function getId() {
  return new Date().getTime().toString(36);
}

const userAttrs = {
  email: 'benoithubert+' + getId() + '@gmail.com',
  "first-name": 'Toto',
  "last-name": 'Tau',
  password: 'SecurePass123$$'
};

describe('Auth backend test', () => {

  it('POST /auth/register', () => agent
    .post('/auth/register')
    .set('Content-Type', 'application/vnd.api+json')
    .send(userAttrs)
    .expect(200)
    .expect('Content-Type', /json/)
    .then(res => {
      res.body.should.have.property('data'); //.and.be.instanceof(Array);
    })
    .catch(err => {
      console.log(err);
      throw err;
    })
  );

});