'use strict'

Users-controller.$inject = [\data,\$state,\$rootScope,\$scope ]
function Users-controller  ( data, $state, $root-scope, $scope )
  vm = @

  vm.users = data

  return

angular
  .module \app.users
  .controller 'UsersController', Users-controller
