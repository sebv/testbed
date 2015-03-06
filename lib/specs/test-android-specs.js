"use strict";

var wd = require('wd'),
    TouchAction = wd.TouchAction,
    _ = require('lodash'),
    Q = require('q');

require('../setup');

var config = require('../config'),
    capsFor = require('../android-caps').capsFor,
    utils = require('../utils');

describe('android tests', function () {
  this.timeout(config.iosTimeout);
  it('should work', function () {
    var caps = capsFor({
      platform: 'ios'
    });
    var driver = wd.promiseChainRemote(config.serverUrl);
    utils.configureDriver(driver);

    return driver
      .init(caps)

      .element('accessibility id', 'Animation').then(function (el) {
       el.should.exist;
      })


      .then(function ok() {
        if(utils.jobStatusEnabled()) return driver.sauceJobStatus(true);
      }).catch(function (err) {
        return new Q(
          utils.jobStatusEnabled() ? driver.sauceJobStatus(false).catch(_.noop) : null
        ).then(function() {
          throw err;
        });
      })
      .finally(function () {
        return driver.quit().catch(_.noop);
      });
  });
});

