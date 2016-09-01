'use strict'

function sortable
  restrict: 'A'
  scope:
    on-drop: '='
    on-drag: '='
    on-drag-start: '='
  link: (scope, element, attr, ng-model) ->

    $ element .add-class 'jquery-sortable' .sortable do
      handle: '.drag-item'
      on-drop: ($item, container, _super) !->
        if scope.on-drop
          scope.on-drop.apply @, arguments
        else
          _super $item, container
      on-drag: ($item, container, _super) !->
        if scope.on-drag
          scope.on-drag.apply @, arguments
        else
          _super $item, container
      on-drag-start: ($item, container, _super) !->
        if scope.on-drag-start
          scope.on-drag-start.apply @, arguments
        else
          _super $item, container

angular
  .module 'app.core'
  .directive 'sortable', sortable
