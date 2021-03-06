'use strict'

function show-animate
  restrict: 'A'
  link: (scope, elem, attr) !->

    $ elem .hide 0

    scope.$watch attr.show-animate, (new-value) !->

      if new-value
        $ elem .slide-down!
      else
        $ elem .slide-up!

angular
  .module 'app.core'
  .directive 'showAnimate', show-animate
