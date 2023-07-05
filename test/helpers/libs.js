/* eslint-disable import/newline-after-import, import/order, import/no-dynamic-require */
const colors = require('ansi-colors');
const path = require('path');
const { expect } = require('chai');
const { stateProxy } = require('./state');
const request = require('supertest')(stateProxy.site);
const data = require(path.join(process.cwd(), stateProxy.datafile));

//console.dir(stateProxy);

module.exports = {
  colors,
  expect,
  request,
  data,
};
