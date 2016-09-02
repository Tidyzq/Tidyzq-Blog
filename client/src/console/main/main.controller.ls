'use strict'

Main-controller.$inject = [\$scope,\$state,\Auth ]
function Main-controller  ( $scope, $state, Auth )

  vm = @

  $scope.$watch 'Auth.isLogedOut' (new-value, old-value) !->
    if new-value
      $state.go 'login'

  return

angular
  .module 'blog'
  .controller 'MainController', Main-controller
