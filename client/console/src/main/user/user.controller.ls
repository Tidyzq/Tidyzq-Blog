'use strict'

User-controller = (data, $state, $scope) !->
  vm = @

  vm.users = data

angular
  .module \app.user
  .controller 'UserController', User-controller
