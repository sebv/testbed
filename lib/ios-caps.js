"use strict";

var genericCaps = require('./generic-caps');

var appiumVersion = genericCaps.appiumVersion;
var orientation = genericCaps.appiumVersion.orientation;

var iosVersion = process.env.IOS_VERSION || 'ios81';
var device = process.env.DEVICE || 'iPhone';

var apps = {
  testApp: {
    "8.1-emu": 'https://github.com/appium/appium/blob/gh-pages/assets/TestApp8.1.app.zip?raw=true',
    "7.1-emu": 'https://github.com/appium/appium/raw/gh-pages/assets/TestApp7.1.app.zip',
  }
};

function testAppFor(iosVersion) {
  switch(iosVersion.toLowerCase()) {
    case 'ios81':
      return apps.testApp["8.1-emu"];
    case 'ios80':
    case 'ios71':
    case 'ios70':
      return apps.testApp["7.1-emu"];
    default:
      throw new Error('No testApp Version for:' + iosVersion);
  }
}

function platformVersionFor(iosVersion) {
  var m = iosVersion.match(/(\d)(\d)/);
  return m[1] + '.' + m[2];
}

function deviceFor(device) {
  if(device.match(/iphone/i)) {
    return "iPhone Simulator";
  } else if(device.match(/ipad/i)) {
    return "iPad Simulator";
  }
}

function testAppCaps() {
  var caps = {
    name: 'testbed',
    platformVersion: platformVersionFor(iosVersion),
    deviceName: deviceFor(device),
    platformName: "iOS",
    "appium-version": appiumVersion,
    app: testAppFor(iosVersion)
  };
  if(orientation) {
    caps.orientation = orientation;
  }
  return caps;
}

exports.capsFor = testAppCaps;

