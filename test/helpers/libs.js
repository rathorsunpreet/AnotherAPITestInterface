/* eslint-disable import/newline-after-import, import/order, import/no-dynamic-require */
const { expect } = require('chai');
const colors = require('ansi-colors');
const path = require('path');
const { stateProxy } = require('./state');
const request = require('supertest')(stateProxy.site);
const data = require(path.join(process.cwd(), stateProxy.datafile));

module.exports = {
  expect,
  colors,
  request,
  data,
};
