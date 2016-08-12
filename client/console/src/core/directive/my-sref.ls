'use strict'

my-sref = ($state) ->
  restrict: 'A'
  scope:
    my-sref: '='
  link: (scope, elem, attr) !->
    target-sref = scope.my-sref

    if target-sref
      elem[0].onclick = !->
        $state.go target-sref

angular
  .module 'app.core'
  .directive 'mySref', my-sref
