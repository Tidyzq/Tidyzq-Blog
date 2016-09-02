'use strict'

my-sref.$inject = [\$state ]
function my-sref  ( $state )
  restrict: 'A'
  scope:
    my-sref: '='
  link: (scope, elem, attr) !->

    scope.$watch 'mySref', !->
      target-sref = scope.my-sref


      [, state, param, tmp] = /([^\(]+)\(([^\)]*)\)|([^\(\)]+)/.exec target-sref

      if param
        param = scope.$root.$eval param

      if not state
        state = tmp

      if target-sref
        elem[0].onclick = !->
          $state.go state, param

angular
  .module 'app.core'
  .directive 'mySref', my-sref
