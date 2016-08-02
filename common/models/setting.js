module.exports = function(Setting) {

  // set unique constraint for key field
  Setting.validatesUniquenessOf('key');


  // find by key
  Setting.findByKey = function (key, cb) {
    Setting.findOne({
      where: { key: key }
    }, function (err, setting) {
      cb(err, setting);
    });
  }

  Setting.remoteMethod(
    'findByKey',
    {
      description: 'Find a setting with key field',
      accepts: { arg: 'key', type: 'string', required: true },
      http: {path: '/:key', verb: 'get'},
      returns: {arg: 'findByKey', type: 'Object'}
    }
  );

  // update by key
  Setting.updateByKey = function (key, data, cb) {
    Setting.updateAll({
      where: { key: key }
    }, data ,function (err, setting) {
      cb(err, setting);
    });
  }

  Setting.remoteMethod(
    'updateByKey',
    {
      description: 'Update a setting with value field filtered by key',
      accepts: [
        { arg: 'key', type: 'string', required: true },
        { arg: 'data', type: 'object', http: { source: 'body' } }
      ],
      http: {path: '/:key', verb: 'put'},
      returns: {arg: 'updateByKey', type: 'Object'}
    }
  );

};
