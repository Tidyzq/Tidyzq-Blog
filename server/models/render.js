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
                if (err) {
                  reject(err);
                } else {
                  resolve(dir);
                }
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
  createDir(dirname);
  return new Promise(function (resolve, reject) {
    fs.writeFile(file, data, options, function(err) {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
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

var indexTemplate = 'client/src/blog/index.jade';

var indexRender = jade.compileFile(indexTemplate);

var distPath = 'client/dist';

if (dev) {
  indexRender = function(locals) {
    return jade.compileFile(indexTemplate)(locals);
  };
  distPath = 'client/.tmp';
}

var renderLocals = {
  shortenHtml: shortenHtml
};

module.exports = function(Render) {

  Render.indexRender = function (callback) {
    callback = callback || utils.createPromiseCallback();
    var Setting = Render.app.models.setting,
        Post = Render.app.models.post;

    return Setting
      .find()
      .then(function (settings) {
        var result = {};
        settings.forEach(function (setting) {
          result[setting.key] = setting.value;
        });
        return {
          settings: result
        };
      })
      .then(function (data) {
        return Post
          .remoteFind({
            include: [
              'author',
              'tags'
            ]
          })
          .then(function (posts) {
            data.posts = posts;
            return data;
          });
      })
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
        data.pageNumber = data.posts.length;
        return data;
      })
      .then(function (data) {
        var renderPromises = [];
        for (var i = 0; i < data.pageNumber; ++i) {
          var locals = _.extend(renderLocals, {
            setting: data.settings,
            posts: data.posts[i],
            pagination: data.paginations[i]
          })
          var html = indexRender(locals);
          var filePath = (i === 0) ? 'index.html'
                                   : ('page/' + (i + 1) + '.html');
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

};
