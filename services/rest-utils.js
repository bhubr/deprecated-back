import pluralize from 'pluralize';
import _ from 'lodash';

/**
 * DB fields (snake_case) <=> JSON API conversion (kebab-case)
 */
function dashLoToHi(row) {
  let output = {};
  for (let k in row) {
    if (k === 'id') continue;
    // Thanks https://gist.github.com/CrowderSoup/9095873
    let hi = k.split('_').join('-');
    output[hi] = row[k];
  }
  return output;
}

/**
 * JSON API conversion (kebab-case) <=> DB fields (snake_case)
 */
function dashHiToLo(row) {
  let output = {};
  for (let k in row) {
    if (k === 'id') continue;
    let lo = k.split('-').join('_');
    output[lo] = row[k];
  }
  return output;
}

/**
 * JSON API conversion (lowerCamelCase) <=> DB fields (snake_case)
 */
function camelToSnake(attributes) {
  let output = {};
  for (let k in attributes) {
    if (k === 'id') continue;
    const snake = _.snakeCase(k);
    output[snake] = attributes[k];
  }
  return output;
}

/**
 * JSON API conversion (lowerCamelCase) <=> DB fields (snake_case)
 */
function snakeToCamel(attributes) {
  let output = {};
  for (let k in attributes) {
    // if (k === 'id') continue;
    const snake = _.camelCase(k);
    output[snake] = attributes[k];
  }
  return output;
}

function DbRowsToJSON(tableName) {
  return function(rows) {
    var plural = pluralize(tableName);
    return _.map(rows, function(row) {
      return {
        type: plural,
        id: row.id,
        attributes: dashLoToHi(row)
      }
    });
  }
}


export default {
  dashLoToHi,
  dashHiToLo,
  camelToSnake,
  snakeToCamel,
  DbRowsToJSON
}