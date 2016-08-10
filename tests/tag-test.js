'use strict';

var assert = require('assert');
var _ = require('lodash');
var faker = require('faker');

var getTag = function() {
  return {
    name: faker.name.title(),
    image: faker.image.image()
  };
};

module.exports = function(json, data) {
  describe('测试tag', function() {

    it('未登陆无法创建标签', function(done) {
      var tag = getTag();
      json('post', '/api/tags')
        .send(tag)
        .expect(401, done);
    });

    it('普通用户可以创建标签', function(done) {
      var tag = getTag();
      json('post', '/api/tags', data.userInfo.accessToken)
        .send(tag)
        .expect(200, function (err, res) {
          assert.ifError(err);
          assert(res.body);
          assert(_.isMatch(res.body, tag));
          data.tags[0] = res.body;
          done();
        });
    });

    it('管理员可以创建标签', function(done) {
      var tag = getTag();
      json('post', '/api/tags', data.adminInfo.accessToken)
        .send(tag)
        .expect(200, function (err, res) {
          assert.ifError(err);
          assert(res.body);
          assert(_.isMatch(res.body, tag));
          data.tags[1] = res.body;
          done();
        });
    });

    it('普通用户可以任意修改标签', function(done) {
      var tag = _.cloneDeep(data.tags[1]);
      tag.description = faker.lorem.sentence();
      json('put', '/api/tags', data.userInfo.accessToken)
        .send(tag)
        .expect(200, function (err, res) {
          assert.ifError(err);
          assert(res.body);
          assert(_.isMatch(res.body, tag));
          data.tags[1] = res.body;
          done();
        });
    });

    it('普通用户可以给自己的文章添加标签', function(done) {
      json('put', '/api/documents/' + data.userInfo.documents[0].id + '/tags/rel/' + data.tags[0].id, data.userInfo.accessToken)
        .expect(200, function (err, res) {
          assert.ifError(err);
          assert(res.body);
          assert.equal(res.body.tagId, data.tags[0].id);
          assert.equal(res.body.documentId, data.userInfo.documents[0].id);
          done();
        });
    });

    it('普通用户不能给其他用户的文章添加标签', function(done) {
      json('put', '/api/documents/' + data.adminInfo.documents[0].id + '/tags/rel/' + data.tags[0].id, data.userInfo.accessToken)
        .expect(401, done);
    });

    it('管理员给其他用户的文章添加标签', function(done) {
      json('put', '/api/documents/' + data.userInfo.documents[1].id + '/tags/rel/' + data.tags[0].id, data.adminInfo.accessToken)
        .expect(200, function (err, res) {
          assert.ifError(err);
          assert(res.body);
          assert.equal(res.body.tagId, data.tags[0].id);
          assert.equal(res.body.documentId, data.userInfo.documents[1].id);
          done();
        });
    });

    it('未登陆用户不能查看标签的文章', function(done) {
      json('get', '/api/tags/' + data.tags[0].id + '/documents')
       .expect(401, done);
    });

    it('普通用户可以查看标签的文章', function(done) {
      json('get', '/api/tags/' + data.tags[0].id + '/documents', data.userInfo.accessToken)
       .expect(200, function (err, res) {
        assert.ifError(err);
        assert(res.body, 'res.body should exists');
        assert(_.isArray(res.body), 'body should be an array');
        assert.deepEqual(res.body.sort(), data.userInfo.documents.sort(), 'documents should be equal');
        done();
       });
    });

    it('普通用户可以查看标签的文章数量', function(done) {
      json('get', '/api/tags/' + data.tags[0].id + '/documents/count', data.userInfo.accessToken)
        .expect(200, function (err, res) {
          assert.ifError(err);
          assert(res.body, 'res.body should exists');
          assert(res.body.count, 'res.body.count should exists');
          assert(_.isNumber(res.body.count), 'res.body.count should be number');
          assert.equal(res.body.count, data.userInfo.documents.length);
          done();
        });
    });

    it('任何人可以查看标签是否存在', function(done) {
      json('get', '/api/tags/' + data.tags[0].id + '/exists')
        .expect(200, function (err, res) {
          assert.ifError(err);
          assert(res.body, 'res.body should exists');
          assert(res.body.exists, 'should exists');
          done();
        });
    });

    it('任何人可以查看标签是否存在(错误示例)', function(done) {
      json('get', '/api/tags/' + '1234' + '/exists')
        .expect(200, function (err, res) {
          assert.ifError(err);
          assert(res.body, 'res.body should exists');
          assert.equal(res.body.exists, false, 'should not exists');
          done();
        });
    });

    it('任何人可以通过url查看标签', function(done) {
      json('get', '/api/tags/url/' + data.tags[0].url)
        .expect(200, function (err, res) {
          assert.ifError(err);
          assert(res.body, 'res.body should exists');
          assert.deepEqual(res.body, data.tags[0], 'should be deep equal');
          done();
        });
    });

    it('任何人可以通过url查看标签(错误示例)', function(done) {
      json('get', '/api/tags/url/' + '1234')
        .expect(404, done);
    });

    it('任何人可以通过url查询标签是否存在', function(done) {
      json('get', '/api/tags/url/' + data.tags[0].url + '/exists')
        .expect(200, function (err, res) {
          assert.ifError(err);
          assert(res.body, 'res.body should exists');
          assert(res.body.exists, 'should exists');
          done();
        });
    });

    it('任何人可以通过url查询标签是否存在(错误示例)', function(done) {
      json('get', '/api/tags/url/' + '1234' + '/exists')
        .expect(200, function (err, res) {
          assert.ifError(err);
          assert(res.body, 'res.body should exists');
          assert.equal(res.body.exists, false, 'should not exists');
          done();
        });
    });

    it('任何人可以通过url查询标签的page', function(done) {
      json('get', '/api/tags/url/' + data.tags[0].url + '/pages')
        .expect(200, function (err, res) {
          assert.ifError(err);
          assert(res.body, 'res.body should exists');
          assert(_.isArray(res.body), 'should be array');
          assert.equal(res.body.length, 1, 'should be equal to 1');
          assert.deepEqual(res.body[0], data.userInfo.documents[0], 'should be equal to document');
          done();
        });
    });

    it('任何人可以通过url查询标签的page(错误示例)', function(done) {
      json('get', '/api/tags/url/' + '1234' + '/pages')
        .expect(404, done);
    });

    it('任何人可以通过url查询标签的page数量', function(done) {
      json('get', '/api/tags/url/' + data.tags[0].url + '/pages/count')
        .expect(200, function (err, res) {
          assert.ifError(err);
          assert(res.body, 'res.body should exists');
          assert(_.isNumber(res.body.count), 'should be number');
          assert.equal(res.body.count, 1, 'should be equal to 1');
          done();
        });
    });

    it('任何人可以通过url查询标签的page数量(错误示例)', function(done) {
      json('get', '/api/tags/url/' + '1234' + '/pages/count')
        .expect(404, done);
    });

    it('任何人可以通过url查询标签的page是否存在', function(done) {
      json('head', '/api/tags/url/' + data.tags[0].url + '/pages/rel/' + data.userInfo.documents[0].id)
        .expect(200, done);
    });

    it('任何人可以通过url查询标签的page是否存在(错误示例)', function(done) {
      json('head', '/api/tags/url/' + '1234' + '/pages/rel/' + data.userInfo.documents[0].id)
        .expect(404, done);
    });

    it('任何人可以通过url查询标签的post', function(done) {
      json('get', '/api/tags/url/' + data.tags[0].url + '/posts')
        .expect(200, function (err, res) {
          assert.ifError(err);
          assert(res.body, 'res.body should exists');
          assert(_.isArray(res.body), 'should be array');
          assert.equal(res.body.length, 1, 'should be equal to 1');
          assert.deepEqual(res.body[0], data.userInfo.documents[1], 'should be equal to document');
          done();
        });
    });

    it('任何人可以通过url查询标签的post(错误示例)', function(done) {
      json('get', '/api/tags/url/' + '1234' + '/posts')
        .expect(404, done);
    });

    it('任何人可以通过url查询标签的post数量', function(done) {
      json('get', '/api/tags/url/' + data.tags[0].url + '/posts/count')
        .expect(200, function (err, res) {
          assert.ifError(err);
          assert(res.body, 'res.body should exists');
          assert(_.isNumber(res.body.count), 'should be number');
          assert.equal(res.body.count, 1, 'should be equal to 1');
          done();
        });
    });

    it('任何人可以通过url查询标签的post数量(错误示例)', function(done) {
      json('get', '/api/tags/url/' + '1234' + '/posts/count')
        .expect(404, done);
    });

    it('任何人可以通过url查询标签的post是否存在', function(done) {
      json('head', '/api/tags/url/' + data.tags[0].url + '/posts/rel/' + data.userInfo.documents[1].id)
        .expect(200, done);
    });

    it('任何人可以通过url查询标签的post是否存在(错误示例)', function(done) {
      json('head', '/api/tags/url/' + '1234' + '/posts/rel/' + data.userInfo.documents[1].id)
        .expect(404, done);
    });

    it('未登陆无法获取文章的标签', function(done) {
      json('get', '/api/documents/' + data.userInfo.documents[0].id + '/tags')
        .expect(401, done);
    });

    it('普通用户可以获取自己文章的标签', function(done) {
      json('get', '/api/documents/' + data.userInfo.documents[0].id + '/tags', data.userInfo.accessToken)
        .expect(200, function (err, res){
          assert.ifError(err);
          assert(res.body, 'res.body should exists');
          assert(_.isArray(res.body), 'should be array');
          assert.equal(res.body.length, 1, 'should be equal to 1');
          assert.deepEqual(res.body[0], data.tags[0], 'should equal to tag');
          done();
        });
    });

    it('普通用户可以获取其他人文章的标签', function(done) {
      json('get', '/api/documents/' + data.adminInfo.documents[0].id + '/tags', data.userInfo.accessToken)
        .expect(200, done);
    });

  });
};
