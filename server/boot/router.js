var loopback = require('loopback');

module.exports = function(app) {
  app.use(loopback.static('client/.tmp'));
  app.use('/vendor', loopback.static('client/vendor'));
};
