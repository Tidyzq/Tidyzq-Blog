'use strict'

Users-controller = (data, $state, $root-scope, $scope) !->
  vm = @

  $root-scope.$broadcast 'config toolbar', do
    parent:
      text: 'User'
      sref: 'app.users'
    buttons:
      * text: 'Add User'
        class: 'btn-success'
        sref: 'app.add-user'

  vm.users = data

angular
  .module \app.users
  .controller 'UsersController', Users-controller
