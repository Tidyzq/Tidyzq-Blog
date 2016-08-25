'use strict'

bootstrap-switch = ->
  restrict: 'A'
  require: 'ngModel'
  scope:
    model: '=ngModel'
  link: (scope, element, attr, ng-model) !->

    $ element .bootstrap-switch!

    # $ element .bootstrap-switch '_width'

    if attr.checked
      ng-model.$set-view-value true
    else
      ng-model.$set-view-value false

    scope.$watch 'model', !->
      # console.log <| $ element .bootstrap-switch 'state'
      $ element .bootstrap-switch 'toggleState', ng-model.$model-value

    $ element .on 'switchChange.bootstrapSwitch', (event, state) !->
      ng-model.$set-view-value state

angular
  .module 'app.core'
  .directive 'bootstrapSwitch', bootstrap-switch
