"use strict";

var mustache = require('mustache');

var testbedConfig = process.env.TESTBED_CONFIG || 'local';

var localAppiumUrl = 'http://localhost:4723/wd/hub';

function buildSauceServerUrl() {
  var urlPattern = 'http://{{usr}}:{{pwd}}@ondemand.saucelabs.com:80/wd/hub';
  return mustache.render(urlPattern, {
    usr: process.env.SAUCE_USERNAME,
    pwd: process.env.SAUCE_ACCESS_KEY
  });
}

function buildDevServerUrl() {
  return mustache.render(process.env.DEV_SERVER_URL, {
    usr: process.env.DEV_SAUCE_USERNAME,
    pwd: process.env.DEV_SAUCE_ACCESS_KEY,
    dev_usr: process.env.DEV_USER
  });
}

switch(testbedConfig.toLowerCase()) {
  case 'prod':
  case 'sauce':
  case 'saucelabs':
    exports.serverUrl = buildSauceServerUrl();
    exports.iosTimeout = 600000;
    break;

  case 'dev':
  case 'stew':
    exports.serverUrl = buildDevServerUrl();
    exports.iosTimeout = 300000;
    break;

  case 'local':
    exports.serverUrl = localAppiumUrl;
    exports.iosTimeout = 180000;
    break;
}

