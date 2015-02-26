"use strict";

var AssertionError = require('chai').AssertionError,
    _ = require('lodash'),
    mustache = require('mustache');

exports.tagChaiAssertionError = function(err) {
  // throw error and tag as retriable to poll again
  err.retriable = err instanceof AssertionError;
  throw err;
};

var isProd = function () {
  switch(process.env.TESTBED_CONFIG.toLowerCase()) {
    case 'prod':
    case 'sauce':
    case 'saucelabs':
      return true;
    default:
      return false;
  }
};
exports.isProd = isProd;

var isDev = function () {
  switch(process.env.TESTBED_CONFIG.toLowerCase()) {
    case 'stew':
    case 'dev':
      return true;
    default:
      return false;
  }
};
exports.isDev = isDev;

exports.configureDriver = function (driver) {
  if(isDev()) {
    driver.sauceRestRoot = mustache.render(process.env.DEV_SAUCE_REST_ROOT, {
      dev_usr: process.env.DEV_USER
    });
  }

  // See whats going on
  driver.on('status', function (info) {
    console.log(info.cyan);
  });
  driver.on('command', function (meth, path, data) {
    console.log(' > ' + meth.yellow, path.grey, data || '');
  });
  driver.on('http', function (meth, path, data) {
    console.log(' > ' + meth.magenta, path, (data || '').grey);
  });
};

exports.booleanFlag = function (flag ,argv) {
  return _(argv).chain()
    .filter(function(val, key) {
      return flag.toLowerCase() === key.toLowerCase();
    }).first().value() ? true : false;
};

exports.jobStatusEnabled = function() {
  return isDev() || isProd();
};
