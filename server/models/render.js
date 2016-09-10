var jade = require('pug');
var utils = require('loopback/lib/utils');
var _ = require('lodash');
var path = require('path');
var fs = require('fs');
var $ = require('cheerio');

function createDir(dir) {
  return new Promise(function (resolve, reject) {
    if (dir !== '.') {
      createDir(path.dirname(dir))
        .then(function () {
          fs.readdir(dir, function (err) {
            if (err) {
              fs.mkdir(dir, function (err) {
                if (err) reject(err);
                else resolve(dir);
              });
            } else {
              resolve(dir);
            }
          });
        });
    } else {
      resolve(dir);
    }
  });
}

function createFile(file, data, options) {
  var dirname = path.dirname(file);
  return new Promise(function (resolve, reject) {
    createDir(dirname)
      .then(function () {
        fs.writeFile(file, data, options, function(err) {
          if (err) {
            reject(err);
          } else {
            resolve(data);
          }
        });
      });
  });
}

function shortenHtml(str) {
  var cut = 100;
  var text = $(str).text();
  if (text.length > cut) {
    text = text.substr(0, cut) + '...';
  }
  return text;
}

var dev = !!process.env.DEV;

var indexTemplate = 'client/src/blog/index.pug';
var postTemplate = 'client/src/blog/post.pug';

var indexRender = jade.compileFile(indexTemplate);
var postRender = jade.compileFile(postTemplate);

var distPath = 'client/dist';

if (dev) {
  indexRender = function(locals) {
    return jade.compileFile(indexTemplate)(locals);
  };
  postRender = function(locals) {
    return jade.compileFile(postTemplate)(locals);
  };
  distPath = 'client/.tmp';
}

var renderLocals = {
  shortenHtml: shortenHtml
};

module.exports = function(Render) {

  var getSettings = function (data) {
    var Setting = Render.app.models.setting;
    return Setting
      .find()
      .then(function (settings) {
        var result = {};
        settings.forEach(function (setting) {
          result[setting.key] = setting.value;
        });
        return _.extend(data, {
          settings: result
        });
      });
  };

  var getPosts = function (data) {
    var Post = Render.app.models.post;
    return Post
      .remoteFind({
        include: [
          'author',
          'tags'
        ]
      })
      .then(function (posts) {
        return _.extend(data, {
          posts: posts
        });
      });
  };

  Render.indexRender = function (callback) {
    callback = callback || utils.createPromiseCallback();

    return getSettings({})
      .then(getPosts)
      // split page and calculate pagination
      .then(function (data) {
        data.posts = _.chunk(data.posts, data.settings.postsPerPage);
        data.paginations = data.posts.map(function (posts, index, array) {
          return {
            index: index + 1,
            totle: array.length,
            first: index === 0,
            last: index === array.length - 1
          };
        });
        data.bodyClasses = data.posts.map(function (posts, index, array) {
          return index === 0 ? 'home-template' : 'paged archive-template';
        });
        data.pageNumber = data.posts.length;
        return data;
      })
      // render pages and save to file
      .then(function (data) {
        var renderPromises = [];
        for (var i = 0; i < data.pageNumber; ++i) {
          var locals = _.extend({
            setting: data.settings,
            posts: data.posts[i],
            pagination: data.paginations[i],
            bodyClass: data.bodyClasses[i]
          }, renderLocals);
          var html = indexRender(locals);
          var filePath = (i === 0) ? 'index.html'
                                   : ('page/' + (i + 1) + '/index.html');
          renderPromises.push(createFile(path.join(distPath, filePath), html));
        }
        return Promise.all(renderPromises);
      })
      .then(function (results) {
        callback(null, 'success');
        return results;
      })
      .catch(function (err) {
        callback(err);
        throw err;
      });
  };

  Render.remoteMethod(
    'indexRender',
    {
      description: 'Render index pages',
      http: {path: '/index-render', verb: 'post'},
      returns: {arg: 'result', type: 'object'}
    }
  );

  Render.postRender = function (callback) {
    callback = callback || utils.createPromiseCallback();
    return getSettings({})
      .then(getPosts)
      .then(function (data) {
        var renderPromises = data.posts.map(function (post) {
          var locals = _.extend({
            setting: data.settings,
            post: post
          }, renderLocals);
          var html = postRender(locals);
          var filePath = post.url + '/index.html';
          return createFile(path.join(distPath, filePath), html);
        });
        return Promise.all(renderPromises);
      })
      .then(function (results) {
        callback(null, 'success');
        return results;
      })
      .catch(function (err) {
        callback(err);
        throw err;
      });
  };

  Render.remoteMethod(
    'postRender',
    {
      description: 'Render post pages',
      http: {path: '/post-render', verb: 'post'},
      returns: {arg: 'result', type: 'object'}
    }
  );

};
