"use strict";

exports.appiumVersion = process.env.APPIUM_VERSION;
if(process.env.CUSTOM_APPIUM_VERSION) {
  exports.appiumVersion = JSON.parse(process.env.CUSTOM_APPIUM_VERSION);
}
exports.orientation = process.env.ORIENTATION;
exports.preventRequeue = process.env.PREVENT_REQUEUE;
