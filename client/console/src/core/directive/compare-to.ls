'use strict'

compare-to = ->
  require: "ngModel"
  scope:
    other-model-value: "=compareTo"
  link: (scope, element, attributes, ngModel) !->

    if attributes.compare-to

      ng-model.$validators.compare-to = (model-value) ->
        model-value == scope.other-model-value

      scope.$watch "otherModelValue", !->
        ng-model.$validate!

angular
  .module 'app.core'
  .directive 'compareTo', compare-to
