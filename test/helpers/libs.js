/* eslint-disable import/newline-after-import, import/order, import/no-dynamic-require */
const colors = require('ansi-colors');
const path = require('path');
const { stateProxy } = require('./state');
const request = require('supertest')(stateProxy.site);
const data = require(path.join(process.cwd(), stateProxy.datafile));

const tobeExported = {
  colors,
  request,
  data,
};

const runnerList = stateProxy.getDef('runner');

// Default is using mocha
switch (stateProxy.runner) {
  case runnerList[1]:
    tobeExported.tap = require('tap');
    break;
  case runnerList[0]:
    tobeExported.expect = require('chai').expect;
    // fall through
  default:
    break;
}

module.exports = tobeExported;
