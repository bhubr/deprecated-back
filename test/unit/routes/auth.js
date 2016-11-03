import Promise from 'bluebird';
import auth from '../../../controllers/auth';
import chai from 'chai';
import config from '../../../config/dev.json';
import httpMocks from 'node-mocks-http';


const should = chai.should();

function getId() {
  return new Date().getTime().toString(36);
}

const body = {
  email: 'benoithubert+' + getId() + '@gmail.com',
  firstName: 'Toto',
  lastName: 'Tau',
  password: 'SecurePass123$$'
};

const request  = httpMocks.createRequest({
    method: 'POST',
    url: '/auth/register',
    body
});
const response = httpMocks.createResponse();

describe('Auth routes', () => {

  it('register', () => {
    
    return auth.postRegister(request, response)
    .then(console.log);
  });

});