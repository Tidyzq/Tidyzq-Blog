'use strict'

Service.$inject = [\Setting,\$rootScope,\$timeout ]
function Service  ( Setting, $rootScope, $timeout )
  Notification = !->

  Notification.prototype.send = (type, message) !->

    element = $ '<div class="notify-wrapper"><center><p class="notify bg-' + type + ' text-' + type + '">' + message + '</p><center></div>'

    # slide up at begining
    element .hide 0

    $ 'body' .append element

    element .show 0

    slide-up element

    slide-up-complete = !->
      element.remove!

    begin-slide-up = !->
      slide-up element, 500, slide-up-complete

    slide-down-complete = !->
      $timeout begin-slide-up, 4000

    slide-down element, 500, slide-down-complete

  slide-down = (elem, dur, complete) !->
    dur = dur || 0
    height = elem .height!
    elem .animate {top: '+=' + height}, dur, complete

  slide-up = (elem, dur, complete) !->
    dur = dur || 0
    height = elem .height!
    elem .animate {top: '-=' + height}, dur, complete

  new Notification!

angular
  .module 'app.core'
  .factory 'Notification', Service
