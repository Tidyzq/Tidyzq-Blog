'use strict'

bootstrap-switch = ->
  restrict: 'A'
  require: 'ngModel'
  scope:
    model: '=ngModel'
  link: (scope, element, attr, ng-model) !->

    $ element .bootstrap-switch!

    scope.$watch 'model', !->
      switch-state =  $ element .bootstrap-switch 'state'
      model-state = ng-model.$model-value
      # console.log switch-state, model-state
      if switch-state is not model-state
        $ element .bootstrap-switch 'toggleState'

    $ element .on 'switchChange.bootstrapSwitch', (event, state) !->
      ng-model.$set-view-value state

angular
  .module 'app.core'
  .directive 'bootstrapSwitch', bootstrap-switch
