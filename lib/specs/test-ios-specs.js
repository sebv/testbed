"use strict";

var wd = require('wd'),
    _ = require('lodash'),
    Q = require('q');

require('../setup');

var config = require('../config'),
    capsFor = require('../ios-caps').capsFor,
    utils = require('../utils');

describe('ios tests', function () {
  this.timeout(config.iosTimeout);
  it('should work', function () {
    var caps = capsFor({
      platform: 'ios'
    });
    var driver = wd.promiseChainRemote(config.serverUrl);
    utils.configureDriver(driver);

    var a = 1, b = 2;

    var sumIsCorrect = new wd.Asserter(function() {
      return driver
        .elementByName('Answer')
        .getValue().should.become('' + (a + b))
        .catch(utils.tagChaiAssertionError);
      }
    );

    return driver
      .init(caps)
      .waitForElementByName('IntegerA')
        .type('' + a)
      .elementByName('IntegerB')
        .type('' + b)
      .elementByName('ComputeSumButton')
        .click()
      .waitFor(sumIsCorrect)
      .then(function ok() {
        if(utils.jobStatusEnabled()) return driver.sauceJobStatus(true);
      }).catch(function (err) {
        console.error("detailed err ->", err);
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

