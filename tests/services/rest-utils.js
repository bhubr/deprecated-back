import Promise from 'bluebird';
import RESTutils from '../../services/rest-utils';
import chai from 'chai';
const should = chai.should();

describe('REST utils', () => {

  it('underscore to dash conversion', () => {
    const converted = RESTutils.dashLoToHi({
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
    const converted = RESTutils.dashHiToLo({
      'id': 666,
      'a-bloody-field': 'a bloody value',
      'another-field': 'another field'
    });
    converted.should.eql({
      'a_bloody_field': 'a bloody value',
      'another_field': 'another field'
    });
  });

});