'use strict'

Toolbar-controller.$inject = [\$scope,\$rootScope,\$state,\Toolbar]
function Toolbar-controller  ( $scope, $root-scope, $state, Toolbar)
  vm = @

  $scope.toolbar = Toolbar.setting

  $scope.$watch 'toolbar.input.text', (new-val) !->
    Toolbar.input-changed new-val

  $scope.click = (index) !->
    Toolbar.on-click index

  return

angular
  .module \app.core
  .controller 'ToolbarController', Toolbar-controller
