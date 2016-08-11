import fs      from 'fs';
import path    from 'path';
import db      from './db-utils';
import rest    from './rest-utils';

// const scandirAsync = Promise.promisify(fs.readdir);
const modelsDir = path.normalize(__dirname + '/../models');
let models = {};

function getModels() {
  const files = fs.readdirSync(modelsDir);
  let _models = {};
  files.forEach(file => {
    const modelName = path.basename(file, '.json');
    const modelDefinition = require(modelsDir + '/' + file);
    _models[modelName] = modelDefinition;
  });
  for (let modelName in _models) {
    models[modelName] = ormize(modelName, _models[modelName]);
  }
  return models;
}

/**
 * Convert a payload to a SQL query
 */
function buildInsertQuery(tableName, modelAttrs) {
  const attributes = rest.camelToSnake(modelAttrs);
  const fields = Object.keys(attributes);
  const sqlFields = '(' + fields.join(',') + ',created_at,updated_at)';
  const theDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
  let sqlValues = [];
  for (let k in attributes) {
    const val = attributes[k];
    if (typeof val === 'number') sqlValues.push(val);
    else if (typeof val === 'boolean') sqlValues.push(val ? 'TRUE' : 'FALSE');
    else if (typeof val === 'string') sqlValues.push("'" + val.split("'").join("''") + "'");
    else if (typeof val === 'undefined') throw new Error('Field ' + k + ' has undefined value');
  }
  sqlValues.push("'" + theDate + "'");
  sqlValues.push("'" + theDate + "'");
  return 'INSERT INTO ' + tableName + sqlFields + ' VALUES(' + sqlValues.join(',') + ')';
}

/**
 * Convert a payload to a SQL query
 */
function buildUpdateQuery(tableName, id, modelAttrs) {
  const attributes = rest.camelToSnake(modelAttrs);
  // const fields = Object.keys(attributes);
  // const sqlFields = '(' + fields.join(',') + ',updated_at)';
  const theDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
  let sqlValues = [];
  for (let k in attributes) {
    let val = attributes[k];
    // if (typeof val === 'number') sqlValues.push(val);
    if (typeof val === 'boolean') val = (val ? 'TRUE' : 'FALSE');
    else if (typeof val === 'string') val = "'" + val.split("'").join("''") + "'";
    else if (typeof val === 'undefined') throw new Error('Field ' + k + ' has undefined value');
    sqlValues.push(k + '=' + val);
  }
  sqlValues.push("updated_at='" + theDate + "'");
  return 'UPDATE ' + tableName + ' SET ' + sqlValues.join(',') + ' WHERE id = ' + id;
}

function ormize(modelName, modelDefinition) {
  return (_modelName => {
    return {
      create: function(values) {
        const conn = db.getConnection();
        const query = buildInsertQuery(_modelName, values);
        console.log('ORM:create:' + _modelName + "\n", query);
        return conn.query(query)
        .then(result => conn.query('SELECT * from ' + _modelName + ' WHERE id = ' + result.insertId))
        .then(entries => rest.snakeToCamel(entries[0]));
      },
  
      read: function(id) {
        const conn = db.getConnection();
        const where = ' WHERE id = ' + id;
        console.log('ORM:read:' + _modelName);
        return conn.query('SELECT * from ' + _modelName + where)
        .then(entries => {
          if (entries.length === 0) return undefined;
          return rest.snakeToCamel(entries[0]);
        });
      },

      readAll: function() {
        const conn = db.getConnection();
        console.log('ORM:readAll:' + _modelName);
        return conn.query('SELECT * from ' + _modelName)
        .then(entries => entries.map(rest.snakeToCamel));

      },

      update: function(id, values) {
        const conn = db.getConnection();
        const query = buildUpdateQuery(_modelName, id, values);
        console.log('ORM:update:' + _modelName + "\n", query);
        return conn.query(query)
        .then(result => conn.query('SELECT * from ' + _modelName + ' WHERE id = ' + id))
        .then(entries => rest.snakeToCamel(entries[0]));
        // .then(console.log);
      },

      delete: function(id) {
        const conn = db.getConnection();
        console.log('ORM:delete:' + _modelName);
        return conn.query('DELETE from ' + _modelName + ' WHERE id = ' + id);
      }
    };
  })(modelName);
}

getModels();
console.log(models);

module.exports = {
  getModels: () => {
    return models;
  }
};
