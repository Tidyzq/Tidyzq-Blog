'use strict'

function Provider
  menu = {}
  Sidebar-menu = {}

  get-arr = (menu) ->
    arr = _.values menu
    arr.for-each (item) !->
      if item.is-group
        item.sub-menu = get-arr item.sub-menu
    arr.sort (a, b) ->
      a.weight = a.weight || 0
      b.weight = b.weight || 0
      if a.weight < b.weight
        -1
      else if a.weight > b.weight
        1
      else
        0

  Sidebar-menu.get-menu = ->
    get-arr menu

  Sidebar-menu.save-item = (state, item) !->
    if item.is-group
      item.sub-menu = {}
    path = state.split '.'
    path = path.join '.subMenu.'
    _.set menu, path, item

  Sidebar-menu.$get = ->
    menu: get-arr menu

  Sidebar-menu

angular
  .module 'app.core'
  .provider 'SidebarMenu', Provider
