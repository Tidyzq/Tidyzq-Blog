// https://github.com/strongloop/loopback/issues/443#issuecomment-222662940
module.exports = function overideRemoteMethod (model, methodName, newFunc) {
  var origFunc = model[methodName];
  model[methodName] = function () {
    // We rely on the remote method call having a different signature to
    // the standard call.
    return newFunc.apply(model, arguments);
  };
};
