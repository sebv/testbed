"use strict";

var genericCaps = require('./generic-caps');

var appiumVersion = genericCaps.appiumVersion;
var orientation = genericCaps.appiumVersion.orientation;

var androidVersion = process.env.ANDROID_VERSION || 'api18';
var device = process.env.DEVICE || 'emu';

var apps = {
  apiDemos: {
    debug: 'https://github.com/appium/appium/raw/gh-pages/assets/ApiDemos-debug.apk'
  }
};

function apiDemosFor(/* androidVersion */) {
  return apps.apiDemos.debug;
}

function platformVersionFor(androidVersion) {
  if(androidVersion.match(/api18/i)) {
    return '4.3';
  } else if(androidVersion.match(/api19/i)) {
    return '4.4';
  }
}

function deviceFor(device) {
  if(device.match(/^emu/i)) {
    return "Android Emulator";
  }
}

function apiDemosCaps() {
  var caps = {
    name: 'testbed',
    platformVersion: platformVersionFor(androidVersion),
    deviceName: deviceFor(device),
    platformName: "Android",
    "appium-version": appiumVersion,
    app: apiDemosFor(androidVersion),
  };
  if(orientation) {
    caps.orientation = orientation;
  }
  return caps;
}

exports.capsFor = apiDemosCaps;

//caps['browserName'] = '';
//caps['appiumVersion'] = '1.3.4';
//caps['deviceName'] = 'Android Emulator';
//caps['device-orientation'] = 'portrait';
//caps['platformVersion'] = '4.3';
//caps['platformName'] = 'Android';
//caps['automationName'] = 'Selendroid';
//caps['app'] = 'sauce-storage:my_app.ap';
