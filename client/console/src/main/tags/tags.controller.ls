'use strict'

Tags-controller = (tags, $state, $scope, $root-scope) !->

  vm = @

  vm.tags = tags

  vm.detail = (document) !->
    $state.go 'app.tags.detail', document

angular
  .module \app.tags
  .controller 'TagsController', Tags-controller
