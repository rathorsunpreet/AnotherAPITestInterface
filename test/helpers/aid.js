const qs = require('qs');

function getKey(str) {
  if (str.includes('=')) {
    return Object.keys(qs.parse(str))[0];
  }
  return '';
}

function getValueArr(str) {
  let strArr = '';
  if (str.includes('=')) {
    strArr = Object.values(qs.parse(str)).toString();
    if (strArr.includes(',')) {
      strArr = strArr.split(',');
    }
    return strArr;
  }
  return '';
}

module.exports = {
  getKey,
  getValueArr,
};
