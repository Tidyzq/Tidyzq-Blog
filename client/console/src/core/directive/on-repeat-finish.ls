'use strict'

on-repeat-finish = ($timeout) ->
  restrict: 'A',
  link: (scope, element, attr) ->
    if scope.$last
      $timeout !->
        scope.$emit attr.on-repeat-finish

angular
  .module 'app.core'
  .directive 'onRepeatFinish', on-repeat-finish
