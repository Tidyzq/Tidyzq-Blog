'use strict'

toggle-sidebar = ->
  restrict: 'A'
  link: (scope, elem, attr) !->

    sidebar = $ attr.toggle-sidebar
    trigger = $ elem

    # remove previous binded handlers
    $ window .off 'click'
    sidebar .off 'click'
    trigger .off 'click'

    toggle = (complete) ->
      console.log 'toggle'
      sidebar .animate {
        width: 'toggle'
      }, 400, 'swing', complete

    visible = ->
      sidebar.is ':visible'

    need-hide = ->
      trigger.is ':visible'

    $ window .click !->
      if visible! && need-hide!
        toggle !->
          sidebar .remove-attr 'style'

    sidebar .click (event) !->
      event.stop-propagation!

    trigger .click (event) !->
      if not visible!
        toggle!
      event.stop-propagation!

angular
  .module 'app.core'
  .directive 'toggleSidebar', toggle-sidebar
