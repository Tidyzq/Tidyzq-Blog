'use strict'

Toolbar-controller  = ($scope, $root-scope, $state, Toolbar) !->
  vm = @

  $scope.toolbar = Toolbar.setting

  $scope.$watch 'toolbar.input.text', (new-val) !->
    Toolbar.input-changed new-val

  $scope.click = (index) !->
    Toolbar.on-click index

angular
  .module \app.core
  .controller 'ToolbarController', Toolbar-controller
