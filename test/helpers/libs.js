/* eslint-disable import/newline-after-import, import/order, import/no-dynamic-require */
const colors = require('ansi-colors');
const path = require('path');
//const { expect } = require('chai');
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
if (stateProxy.runner.localeCompare(runnerList[1]) === 0) {
  tobeExported.expect = require('chai').expect;
} else if (stateProxy.runner.localeCompare(runnerList[0]) === 0) {
  tobeExported.tap = require('tap');
} else {
  tobeExported.expect = require('chai').expect;
}

module.exports = tobeExported;
