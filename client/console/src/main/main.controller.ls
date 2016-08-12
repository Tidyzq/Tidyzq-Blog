'use strict'

Main-controller = ($scope, $state, Auth) !->

  vm = @

  $scope.$watch 'Auth.isLogedOut' (newValue, oldValue) !->
    if newValue
      $state.go 'login'

angular
  .module 'blog'
  .controller 'MainController', Main-controller

