/**
 * DB fields (snake_case) <=> JSON API conversion (kebab-case)
 */

/**
 *
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

function dashHiToLo(row) {
  let output = {};
  for (let k in row) {
    if (k === 'id') continue;
    let lo = k.split('-').join('_');
    output[lo] = row[k];
  }
  return output;
}


export default {
  dashLoToHi,
  dashHiToLo
}