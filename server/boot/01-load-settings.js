'use strict';

var log = require('debug')('boot:01-load-settings');

module.exports = function(app, done) {
  var Setting = app.models.setting;

  // init settings
  function initSettings() {
    return new Promise(function(resolve, reject) {

      log('creating default settings');

      var settings = [
        {
          key: 'title',
          value: 'Tidyzq\'s Blog'
        },
        {
          key: 'navigation',
          value: '[{\"label\":\"Home\",\"url\":\"/\"}]'
        },
        {
          key: 'postsPerPage',
          value: '5'
        }
      ];

      var promises = [];

      settings.forEach(function(setting) {
        promises.push(new Promise(function (resolve, reject) {
          Setting.create(setting, function(err) {
            if (err) {
              reject('Error on initSettings: ' + err);
            } else {
              resolve();
            }
          });
        }));
      });

      Promise.all(promises).then(resolve, reject);
    });
  }

  function loadSettings() {
    return new Promise(function(resolve, reject) {

      log('loading exsisting settings');

      Setting.find(function(err, data) {
        if (err) {
          reject('Error on loadSettings: ' + err);
        } else {
          log(data);
          resolve();
        }
      });
    });
  }

  // check if setting already inited
  var work = new Promise(function(resolve, reject) {
    Setting.count(function(err, result) {
      if (err) {
        reject('Error on Setting.count: ' + err);
      } else {
        if (result) {
          loadSettings()
            .then(resolve, reject);
        } else {
          initSettings()
            .then(resolve, reject);
        }
      }
    });
  });

  work.then(function() {
    log('done');
    done();
  }, console.error);
};
