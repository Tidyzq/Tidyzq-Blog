select2 = ->
  restrict: 'A'
  require: 'ngModel'
  link: (scope, element, attr, ng-model) ->

    $ element .select2 {
      dropdown-css-class: 'dropdown-inverse'
    }

    watch = ->
      ng-model.$model-value

    scope.$watch watch, !->
      $ element .select2 'val', ng-model.$model-value

    $ element .on 'change', !->
      val = $ element .val!
      scope.$apply !->
        ng-model.$set-view-value val

angular
  .module 'app.core'
  .directive 'select2', select2
