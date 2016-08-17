'use strict'

bootstrap-switch = ->
  restrict: 'A'
  require: 'ngModel'
  link: (scope, element, attr, ng-model) ->

    $ element .bootstrap-switch!

    if attr.checked
      ng-model.$set-view-value true
    else
      ng-model.$set-view-value false

    $ element .on 'switchChange.bootstrapSwitch', (event, state) !->
      ng-model.$set-view-value state

angular
  .module 'app.core'
  .directive 'bootstrapSwitch', bootstrap-switch
