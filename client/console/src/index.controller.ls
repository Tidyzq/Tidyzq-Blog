'use strict'

index-controller = ($scope, Auth, User) !->
  vm = @

angular
  .module \blog
  .controller 'IndexController', index-controller
