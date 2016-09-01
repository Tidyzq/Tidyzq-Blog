'use strict'

function select2
  restrict: 'A'
  require: 'ngModel'
  link: (scope, element, attr, ng-model) ->

    $ element .select2 do
      dropdown-css-class: 'dropdown-inverse'

    watch = ->
      ng-model.$model-value

    scope.$watch watch, !->
      # console.log ng-model.$model-value
      $ element .select2 'val', ng-model.$model-value

    scope.$on 'set select2', !->
      # console.log ng-model.$model-value
      $ element .select2 'val', ng-model.$model-value

    $ element .on 'change', !->
      val = $ element .val!
      # console.log val
      scope.$apply !->
        ng-model.$set-view-value val

angular
  .module 'app.core'
  .directive 'select2', select2
