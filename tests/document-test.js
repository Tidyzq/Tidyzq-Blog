'use strict';

var assert = require('assert');
var _ = require('lodash');
var faker = require('faker');
var marked = require('marked');

var getDocument = function() {
  return {
    title: faker.name.title(),
    markdown: faker.fake('> {{lorem.sentence}}'),
    status: faker.random.arrayElement([
      'published',
      'draft'
    ]),
    isPage: faker.random.boolean()
  };
};

module.exports = function(json, data) {
  describe('测试document', function() {

    it('未登陆无法创建文章', function(done) {
      var doc = getDocument();
      doc.authorId = data.userInfo.id;
      json('post', '/api/documents')
        .send(doc)
        .expect(401, done);
    });

    it('普通用户创建文章', function(done) {
      var doc = getDocument();
      doc.authorId = data.userInfo.id;
      doc.status = 'draft';
      json('post', '/api/documents', data.userInfo.accessToken)
        .send(doc)
        .expect(200, function (err, res) {
          assert.ifError(err);
          assert(_.isMatch(res.body, doc));
          assert.equal(res.body.html, marked(res.body.markdown));
          assert.equal(res.body.authorId, data.userInfo.id);
          // 将创建的文章放入userInfo
          data.userInfo.documents.push(res.body);
          done();
        });
    });

    it('通过users接口创建', function(done) {
      var doc = getDocument();
      doc.authorId = data.userInfo.id;
      doc.status = 'draft';
      json('post', '/api/users/' + data.userInfo.id + '/documents', data.userInfo.accessToken)
        .send(doc)
        .expect(200, function (err, res) {
          assert.ifError(err);
          assert(_.isMatch(res.body, doc));
          assert.equal(res.body.html, marked(res.body.markdown));
          assert.equal(res.body.authorId, data.userInfo.id);
          // 将创建的文章放入userInfo
          data.userInfo.documents.push(res.body);
          done();
        });
    });

    it('管理员创建文章', function(done) {
      var doc = getDocument();
      doc.authorId = data.adminInfo.id;
      doc.status = 'draft';
      json('post', '/api/documents', data.adminInfo.accessToken)
        .send(doc)
        .expect(200, function (err, res) {
          assert.ifError(err);
          assert(_.isMatch(res.body, doc));
          assert.equal(res.body.html, marked(res.body.markdown));
          assert.equal(res.body.authorId, data.adminInfo.id);
          // 将创建的文章放入adminInfo
          data.adminInfo.documents.push(res.body);
          done();
        });
    });

    it('未登陆无法获取文章列表', function(done) {
      json('get', '/api/documents')
        .expect(401, done);
    });

    it('普通用户可以获取文章列表', function(done) {
      json('get', '/api/documents', data.userInfo.accessToken)
        .expect(200, function (err, res) {
          assert.ifError(err);
          assert(_.isArray(res.body));
          // res.body 中是否包含 userInfo.documents
          assert(_.every(data.userInfo.document, function (doc) { return _.includes(res.body, doc); }));
          // res.body 中是否包含 adminInfo.documents
          assert(_.every(data.adminInfo.document, function (doc) { return _.includes(res.body, doc); }));
          done();
        });
    });

    it('通过users接口获取', function(done) {
      json('get', '/api/users/' + data.userInfo.id + '/documents', data.userInfo.accessToken)
        .expect(200, function (err, res) {
          assert.ifError(err);
          assert(_.isArray(res.body));
          assert.deepEqual(res.body, data.userInfo.documents);
          done();
        });
    });

    it('未登陆无法修改文章', function(done) {
      json('put', '/api/documents')
        .send(data.userInfo.documents[0])
        .expect(401, done);
    });

    it('普通用户可以修改自己的文章', function(done) {
      var doc = _.cloneDeep(data.userInfo.documents[0]);
      doc = _.omit(doc, 'html');
      doc.markdown = faker.fake('> {{lorem.sentence}}');
      doc.isPage = true;
      doc.status = 'published';
      json('put', '/api/documents', data.userInfo.accessToken)
        .send(doc)
        .expect(200, function (err, res) {
          assert.ifError(err);
          assert(res.body);
          assert.equal(res.body.html, marked(res.body.markdown));
          assert.equal(res.body.isPage, true);
          assert.equal(res.body.status, 'published');
          assert(_.isMatch(res.body, doc));
          data.userInfo.documents[0] = res.body;
          done();
        });
    });

    it('普通用户不能修改其他人文章', function(done) {
      json('put', '/api/documents', data.userInfo.accessToken)
        .send(data.adminInfo.documents[0])
        .expect(401, done);
    });

    it('管理员可以修改其他用户的文章', function(done) {
      var doc = _.cloneDeep(data.userInfo.documents[1]);
      doc = _.omit(doc, 'html');
      doc.markdown = faker.fake('> {{lorem.sentence}}');
      doc.isPage = false;
      doc.status = 'published';
      json('put', '/api/documents', data.adminInfo.accessToken)
        .send(doc)
        .expect(200, function (err, res) {
          assert.ifError(err);
          assert(res.body);
          assert.equal(res.body.html, marked(res.body.markdown));
          assert.equal(res.body.isPage, false);
          assert.equal(res.body.status, 'published');
          assert(_.isMatch(res.body, doc));
          data.userInfo.documents[1] = res.body;
          done();
        });
    });

    it('未登录用户不能通过url获取文章', function(done) {
      json('get', '/api/documents/url/' + data.userInfo.documents[0].url)
        .expect(401, done);
    });

    it('普通用户可以通过url获取文章', function(done) {
      json('get', '/api/documents/url/' + data.adminInfo.documents[0].url, data.userInfo.accessToken)
        .expect(200, function (err, res) {
          assert.ifError(err);
          assert(res.body);
          assert.deepEqual(res.body, data.adminInfo.documents[0]);
          done();
        });
    });

  });
};
