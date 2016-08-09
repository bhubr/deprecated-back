import RestUtils from './rest-utils';
import _ from 'lodash';

/**
 * Convert a payload to a SQL query
 */
function payloadToQuery(tableName, payload) {
  const attributes = RestUtils.dashHiToLo(payload);
  const fields = _.keys(attributes);
  const sqlFields = '(' + fields.join(',') + ')';
  let sqlValues = [];
  for (let k in attributes) {
    const val = attributes[k];
    if (typeof val === 'number') sqlValues.push(val);
    if (typeof val === 'boolean') sqlValues.push(val ? 'TRUE' : 'FALSE');
    if (typeof val === 'string') sqlValues.push("'" + val.split("'").join("''") + "'");
    if (typeof val === 'undefined') throw new Error('Field ' + k + ' has undefined value');
  }
  return 'INSERT INTO ' + tableName + sqlFields + ' VALUES(' + sqlValues.join(',') + ')';
}

export default {
  payloadToQuery
}