'use strict';

var assert = require('assert');
var _ = require('lodash');

module.exports = function(json, data) {
  describe('测试render', function () {

    it('任何人不能调用render', function(done) {
      json('post', '/api/renders/all')
        .expect(401, done);
    });

    it('注册用户可以调用render', function(done) {
      json('post', '/api/renders/all', data.userInfo.accessToken)
        .expect(200, done);
    });

  });
};
