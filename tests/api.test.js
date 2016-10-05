'use strict';

/* jshint camelcase: false */
var app = require('../server/server');
var request = require('supertest');
var assert = require('assert');
var loopback = require('loopback');

var json = function (verb, url, auth) {
  var promise = request(app)[verb](url)
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json');

  if (auth && typeof auth === 'string') {
    promise = promise
      .set('Authorization', auth);
  }

  return promise
    .expect('Content-Type', /json/);
};

var data = {
  user: {
    username: 'tidyzq',
    password: '123456',
    email: 'tidyzq@tidyzq.com'
  },
  userInfo: {
    id: 0,
    accessToken: '',
    documents: []
  },
  admin: {
    username: 'admin',
    password: 'admin',
    email: 'admin@admin.com'
  },
  adminInfo: {
    id: 0,
    accessToken: '',
    documents: []
  },
  tags: [],
  settings: []
};

describe('REST API request', function() {
  before(function(done) {
    this.timeout(10000);
    require('./start-server')(done);
  });

  after(function(done) {
    app.removeAllListeners('started');
    app.removeAllListeners('loaded');
    done();
  });

  require('./user-test')(json, data);
  require('./document-test')(json, data);
  require('./tag-test')(json, data);
  require('./page-test')(json, data);
  require('./post-test')(json, data);
  require('./setting-test')(json, data);
  require('./render-test')(json, data);

});
