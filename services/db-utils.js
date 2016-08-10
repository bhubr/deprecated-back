import mysql from 'promise-mysql';
import _     from 'lodash';
import RestUtils from './rest-utils';


export default {

  /**
   * Connection instance
   */
  connection: null,

  /**
   * Get connection
   */
  getConnection() {
    if (this.connection === null) throw new Error('[DB] connection not ready');
    return this.connection;
  },

  /**
   * Connection ready handler
   */
  onConnectionReady: function(conn) {
    this.connection = conn;
  },

  /**
   * Initialize connection
   */
  init: function(dbParams) {
    mysql.createConnection(dbParams).then(this.onConnectionReady.bind(this));
  },

  /**
   * Convert a payload to a SQL query
   */
  payloadToQuery: function(tableName, payload) {
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

}