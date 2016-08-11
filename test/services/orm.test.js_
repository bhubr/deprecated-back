import Promise from 'bluebird';
// import DB from '../../services/db-utils';
import ORM from 'ormist';
import chai from 'chai';
import tokenUtil from '../../services/token';
import config from '../../config';

const should = chai.should();
const tokenAttrs = {
  value: tokenUtil.gen(32),
  validity: 60,
  userId: 1,
  usageFor: 'auth:confirm-email'
};
DB.init(config.db);

describe('ORM', () => {

  it('return models', () => {
    const models = ORM.getModels();
    const keys = Object.keys(models);
    keys.should.eql(['token']);
  });

  it('create a token', () => {
    const Token = ORM.getModels().token;
    return Token.create(tokenAttrs)
    .then(token => {
      // Should be removed because snake_case
      should.not.exist(token.created_at);
      should.not.exist(token.updated_at);
      should.not.exist(token.user_id);
      should.not.exist(token.usage_for);

      // Check that other fields have good value
      should.exist(token.id);
      token.value.length.should.eql(32);
      token.validity.should.eql(60);
      token.userId.should.eql(1);
      token.usageFor.should.eql('auth:confirm-email');
      should.exist(token.createdAt)
      should.exist(token.updatedAt);
    });

  });

  it('creates two tokens and fetches them all', () => {
    const Token = ORM.getModels().token;
    return Promise.all([ Token.create(tokenAttrs), Token.create(tokenAttrs) ])
    .then(tokens => {
      tokens.length.should.eql(2);
      return Token.readAll();
    })
    .then(tokens =>  {
      // tokens.length.should.eql(2);
      // console.log(tokens);
      // return Token.readAll();
    });

  });

  it('creates a token and fetches it', () => {
    const Token = ORM.getModels().token;
    let token;
    return Token.create(tokenAttrs)
    .then(_token => {
      token = _token;
      return Token.read(_token.id);
    })
    .then(_token =>  {
      _token.should.eql(token);
    });

  });

  it('creates a token and updates it', () => {
    const Token = ORM.getModels().token;
    let token;
    const updatedValues = { validity: 120, usageFor: 'auth:lostpass' };
    return Token.create(tokenAttrs)
    .then(_token => {
      token = Object.assign(_token, updatedValues);
      return Token.update(_token.id, { validity: 120, usageFor: 'auth:lostpass' });
    })
    .then(_token =>  {
      _token.should.eql(token);
    });

  });

it('creates a token and deletes it', () => {
    const Token = ORM.getModels().token;
    let token;
    return Token.create(tokenAttrs)
    .then(_token => {
      token = _token
      return Token.delete(_token.id);
    })
    .then(result =>  {
      console.log(result);
      return Token.read(token.id)
    })
    .then(_notFoundToken => {
      should.not.exist(_notFoundToken);
    });

  });

});