'use strict'

Main-controller = ($scope, $state, Auth) !->

  vm = @

  $scope.$watch 'Auth.isLogedOut' (new-value, old-value) !->
    if new-value
      $state.go 'login'

angular
  .module 'blog'
  .controller 'MainController', Main-controller
