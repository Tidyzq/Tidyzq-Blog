'use strict'

index-controller.$inject = [\$scope,\Auth,\User,\BlogSetting ]
function index-controller  ( $scope, Auth, User, Blog-setting )
  vm = @

  watch = ->
    Blog-setting.is-loaded

  $scope.$watch watch, (is-loaded) !->
    if is-loaded
      vm.logo = Blog-setting.current-setting.logo
      vm.title = Blog-setting.current-setting.title

  return

angular
  .module \blog
  .controller 'IndexController', index-controller
