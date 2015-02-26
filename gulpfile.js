"use strict";

var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    mochaStream = require('spawn-mocha-parallel').mochaStream,
    utils = require('./lib/utils'),
    _ = require('lodash');

var argv = require('yargs').argv;

var newMocha = function(opts) {
  opts = opts || {};
  _.defaults(opts, {
    concurrency: 1,
    liveOutput: true,
    errorSummary: false,
    flags: ['--colors']
  });
  return mochaStream(opts);
};

gulp.task('jshint', function() {
    return gulp.src(['*.js', './lib/*.js'])
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('test-ios', function () {
  var env = _(process.env).clone();

  // config selection
  var configs = ['dev', 'stew', 'sauce', 'prod', 'saucelabs', 'local'];
  _.chain(configs).filter(function (c) {
    return utils.booleanFlag(c, argv);
  }).each(function (c) {
    env.TESTBED_CONFIG = c.toLowerCase();
  }).value();

  // ios version selection
  var versions = ['ios81', 'ios80', 'ios71', 'ios70'];
  _.chain(versions).filter(function (v) {
    return utils.booleanFlag(v, argv);
  }).each(function (v) {
    env.IOS_VERSION = v.toLowerCase();
  }).value();

  // appium version selection
  if(argv.appiumVersion) {
    env.APPIUM_VERSION = argv.appiumVersion;
  }

  // device selection
  var devices = ['iphone', 'ipad'];
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

  var mocha = newMocha({env: env});
  return gulp.src('lib/specs/test-ios-specs.js', {read: false})
    .pipe(mocha)
    .on('error', console.error);
});

gulp.task('hello-world' , function () {
  console.log(argv);
  console.log('Hello World!');
});

gulp.task('default', ['jshint']);
