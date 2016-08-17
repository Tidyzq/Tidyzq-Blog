'use strict'

Toolbar-controller  = (  $scope, $root-scope, $state ) !->
  vm = @

  $scope.toolbar = {}

  clear-object = (obj) ->
    for key in _.keys obj
      if obj.hasOwnProperty key
        delete obj[key]
    obj

  $scope.$on 'config toolbar', (event, config) !->

    if config.buttons && not _.is-array config.buttons
      config.buttons = [ config.buttons ]
    # console.log event, config
    clear-object $scope.toolbar
    $scope.toolbar = _.extend $scope.toolbar, config

    $root-scope.$broadcast 'toolbar loaded'

  $scope.$on 'disable toolbar button', (event, index) !->
    $scope.toolbar.buttons[index].disabled = true

  $scope.$on 'enable toolbar button', (event, index) !->
    $scope.toolbar.buttons[index].disabled = false

  $scope.$watch 'toolbar.input.text', (new-val) !->
    $root-scope.$broadcast 'toolbar input changed', new-val

  $scope.click = (index) !->
    $root-scope.$broadcast 'toolbar button clicked', index

angular
  .module \app.core
  .controller 'ToolbarController', Toolbar-controller
