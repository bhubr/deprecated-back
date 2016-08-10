import Promise from 'bluebird';
import DB from '../../services/db-utils';
import chai from 'chai';
import config from '../../config';

const should = chai.should();

DB.init(config.db);

describe('DB utils', () => {

  it('payload to SQL conversion', () => {
    const sql = DB.payloadToQuery('user', {
      'id': 666,
      'a-bloody-string': 'a bloody string',
      'another-string': 'another string',
      'an-integer': 777
    });
    sql.should.eql("INSERT INTO user(a_bloody_string,another_string,an_integer) VALUES('a bloody string','another string',777)");
  });

});