'use strict'

Users-controller = (data, $state, $root-scope, $scope) !->
  vm = @

  vm.users = data

angular
  .module \app.users
  .controller 'UsersController', Users-controller
