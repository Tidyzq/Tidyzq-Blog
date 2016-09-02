'use strict'

angular
  .module \blog
  .controller 'IndexController', index-controller

index-controller.$inject = [\$scope,\Auth,\User ]
function index-controller  ( $scope, Auth, User )
  vm = @

  return
