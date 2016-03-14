var _ = require('lodash');
var promise = require('bluebird');
var webdriver = require('selenium-webdriver');
var fs = require("fs");
var async = promise.promisifyAll(require('async'));
var sanitize = require("sanitize-filename");

module.exports = {
  /*
   * Takes snapshots of pages
   * @param pages Array
   * @param width Number
   */
  get: function (pages, width) {
    console.time('snapshots');
    async.mapLimitAsync(pages, 10, function (page, callback) {
      console.log(page);
      var flow = new webdriver.promise.ControlFlow()
        .on('uncaughtException', function(e) {
          console.log('uncaughtException in flow %d: %s', page, e);
        });

      var driver = new webdriver.Builder()
        .forBrowser('firefox')
        // .usingServer();
        .setControlFlow(flow)
        .build();

      driver.manage().window().setSize(width || 1024,768);
      driver.get(page);

      var filename = './snapshots/' + sanitize(page + '.png', { replacement: '_' });
      return driver.takeScreenshot().then(function(data) {
        driver.quit();
        return fs.writeFile(filename, data.replace(/^data:image\/png;base64,/,''), 'base64', callback);
      });
    })
      .then(function () {
       console.log('images pulled');
       console.timeEnd('snapshots');
      });
  },
  compare: function (pages, bases, width) {
    console.time('snapshots');
    async.mapLimitAsync(pages, 8, function (page, callback) {
      var captures = [];
      var flow = new webdriver.promise.ControlFlow()
        .on('uncaughtException', function(e) {
          console.log('uncaughtException in flow %d: %s', page, e);
        });

      var driver = new webdriver.Builder()
        .forBrowser('firefox')
        // .usingServer();
        .setControlFlow(flow)
        .build();

      driver.manage().window().setSize(width || 1024,768);
      _.each(bases, function (base) {
        driver.get(base + page);
        captures.push(driver.takeScreenshot())
      });
      driver.quit();
      util.compare(captures)
        .then(callback);
    })
      .then(function () {
       console.log('images compared');
       console.timeEnd('snapshots');
      });
  }
};
