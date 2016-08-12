'use strict'

show-animate = ->
  restrict: 'A'
  link: (scope, elem, attr) !->

    scope.$watch attr.show-animate, (new-value) !->

      if new-value
        $ elem .remove-class 'ng-hide'
        $ elem .slide-down!
      else
        $ elem .slide-up!

angular
  .module 'app.core'
  .directive 'showAnimate', show-animate
