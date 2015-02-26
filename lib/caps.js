"use strict";

var iosVersion = process.env.IOS_VERSION || 'ios81';
var appiumVersion = process.env.APPIUM_VERSION || '1.3.4';
var device = process.env.DEVICE || 'iPhone';
var orientation = process.env.ORIENTATION;

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

