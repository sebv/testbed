"use strict";

var argv = require('yargs')
  .string('appiumVersion')
  .argv,
  mergeStream = require('merge-stream'),
  _ = require('lodash');

var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    mochaStream = require('spawn-mocha-parallel').mochaStream,
    utils = require('./lib/utils'),
    _ = require('lodash');

var concurrency = argv.concurrency || 1;

var newMocha = function(opts) {
  opts = opts || {};
  _.defaults(opts, {
    concurrency: concurrency,
    liveOutput: concurrency === 1,
    errorSummary: concurrency > 1,
    flags: ['--colors']
  });
  return mochaStream(opts);
};

gulp.task('jshint', function() {
    return gulp.src(['*.js', './lib/*.js'])
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

function runTests(platform) {
  var env = _(process.env).clone();

  // config selection
  var configs = ['dev', 'stew', 'sauce', 'prod', 'saucelabs', 'local'];
  _.chain(configs).filter(function (c) {
    return utils.booleanFlag(c, argv);
  }).each(function (c) {
    env.TESTBED_CONFIG = c.toLowerCase();
  }).value();

  if(platform === 'ios') {
    // ios version selection
    var iosVersions = ['ios81', 'ios80', 'ios71', 'ios70', 'ios61'];
    _.chain(iosVersions).filter(function (v) {
      return utils.booleanFlag(v, argv);
    }).each(function (v) {
      env.IOS_VERSION = v.toLowerCase();
    }).value();
  }

  if(platform === 'android') {
    // android version selection
    var androidVersions = ['api18', 'api19'];
    _.chain(androidVersions).filter(function (v) {
      return utils.booleanFlag(v, argv);
    }).each(function (v) {
      env.ANDROID_VERSION = v.toLowerCase();
    }).value();
  }

  // appium version selection
  if(argv.appiumVersion) {
    env.APPIUM_VERSION = argv.appiumVersion;
  }

  // device selection
  var devices = ['iphone', 'ipad', 'phone', 'tablet'];
  _.chain(devices).filter(function (d) {
    return utils.booleanFlag(d, argv);
  }).each(function (d) {
    env.DEVICE = d.toLowerCase();
  }).value();

  // orientation
  var orientations = ['portrait', 'landscape'];
  _.chain(orientations).filter(function (o) {
    return utils.booleanFlag(o, argv);
  }).each(function (o) {
    env.ORIENTATION = o.toLowerCase();
  }).value();

  if(utils.booleanFlag('prevent-requeue', argv)) {
    env.PREVENT_REQUEUE = 1;
  }

  var mocha = newMocha({env: env});
  var merged;
  if(platform === 'ios') {
    merged = new mergeStream();
    _(concurrency).times(function() {
      merged.add(gulp.src('lib/specs/test-ios-specs.js'));
    }).value();
    return merged
      .pipe(mocha)
      .on('error', console.error);
  } else if(platform === 'android') {
    merged = new mergeStream();
    _(concurrency).times(function() {
      merged.add(gulp.src('lib/specs/test-android-specs.js'));
    }).value();
    return merged
      .pipe(mocha)
      .on('error', console.error);
  }
}

gulp.task('test-ios', function () {
  return runTests('ios');
});

gulp.task('test-android', function () {
  return runTests('android');
});

gulp.task('hello-world' , function () {
  console.log(argv);
  console.log('Hello World!');
});

gulp.task('default', ['jshint']);
