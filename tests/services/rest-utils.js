// mocha --compilers js:babel-core/register tests/services/rest-utils.js
import Promise from 'bluebird';
import RestUtils from '../../services/rest-utils';
import chai from 'chai';
const should = chai.should();

describe('REST utils', () => {

  it('underscore to dash conversion', () => {
    const converted = RestUtils.dashLoToHi({
      'id': 666,
      'a_bloody_field': 'a bloody value',
      'another_field': 'another field'
    });
    converted.should.eql({
      'a-bloody-field': 'a bloody value',
      'another-field': 'another field'
    });
  });

  it('dash to underscore conversion', () => {
    const converted = RestUtils.dashHiToLo({
      'id': 666,
      'a-bloody-field': 'a bloody value',
      'another-field': 'another field'
    });
    converted.should.eql({
      'a_bloody_field': 'a bloody value',
      'another_field': 'another field'
    });
  });

  it('lowerCamelCase to snake_case conversion', () => {
    const converted = RestUtils.camelToSnake({
      'id': 666,
      'aBloodyField': 'a bloody value',
      'anotherField': 'another field'
    });
    converted.should.eql({
      'a_bloody_field': 'a bloody value',
      'another_field': 'another field'
    });
  });

  it('db rows to JSON payload conversion', () => {
    const converter = RestUtils.DbRowsToJSON('user');
    const json = converter([
      { id: 1, name: 'Toto', status: 'Angry' },
      { id: 2, name: 'Tutu', status: 'Cool' }
    ]);
    json.should.eql([ {
      type: 'users',
      id: 1,
      attributes: { name: 'Toto', status: 'Angry' }
    },
    {
      type: 'users',
      id: 2,
      attributes: { name: 'Tutu', status: 'Cool' }
    } ]);
  });

});