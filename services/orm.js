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
    if (typeof val === 'boolean') sqlValues.push(val ? 'TRUE' : 'FALSE');
    if (typeof val === 'string') sqlValues.push("'" + val.split("'").join("''") + "'");
    if (typeof val === 'undefined') throw new Error('Field ' + k + ' has undefined value');
  }
  sqlValues.push("'" + theDate + "'");
  sqlValues.push("'" + theDate + "'");
  return 'INSERT INTO ' + tableName + sqlFields + ' VALUES(' + sqlValues.join(',') + ')';
}


function ormize(modelName, modelDefinition) {
  return (_modelName => {
    return {
      create: function(values) {
        const conn = db.getConnection();
        const query = buildInsertQuery(modelName, values);
        console.log('ORM:create:' + modelName + "\n", query);
        return conn.query(query)
        .then(result => conn.query('SELECT * from ' + _modelName + ' WHERE id = ' + result.insertId))
        .then(entries => entries[0]);
      },
  
      read: function(id) {
        console.log('ORM:read:' + modelName);
      },

      readAll: function() {
        console.log('ORM:readAll:' + modelName);
      },

      update: function(id, values) {
        console.log('ORM:update:' + modelName);
      },

      delete: function(id) {
        console.log('ORM:delete:' + modelName);
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
