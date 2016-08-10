import Promise from 'bluebird';
import DB from '../../services/db-utils';
import ORM from '../../services/orm';
import chai from 'chai';
import tokenUtil from '../../services/token';
import config from '../../config';

const should = chai.should();
DB.init(config.db);

describe('ORM', () => {

  it('return models', () => {
    // const sql = DbUtils.payloadToQuery('user', {
    //   'id': 666,
    //   'a-bloody-string': 'a bloody string',
    //   'another-string': 'another string',
    //   'an-integer': 777
    // });
    // sql.should.eql("INSERT INTO user(a_bloody_string,another_string,an_integer) VALUES('a bloody string','another string',777)");
    const models = ORM.getModels();
    const keys = Object.keys(models);
    keys.should.eql(['token']);
  });

  it('create a token', () => {
    const Token = ORM.getModels().token;
    return Token.create({
      value: tokenUtil.gen(32),
      validity: 60,
      userId: 1,
      usageFor: 'auth:confirm-email'
    })
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

});