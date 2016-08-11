'use strict'

Service = ->
  Sidebar-menu = !->
    @menu = []

  Sidebar-menu.prototype.get-menu = ->
    @menu.sort (a, b) ->
      a.weight = a.weight || 0
      b.weight = b.weight || 0
      if a.weight < b.weight
        1
      else if a.weight > b.weight
        -1
      else
        0

  Sidebar-menu.prototype.save-item = (item) !->
    @menu.push item

  new Sidebar-menu!

angular
  .module 'app.core'
  .factory 'SidebarMenu', Service
