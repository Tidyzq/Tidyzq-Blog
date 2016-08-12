'use strict'

sidebar-item = ($compile) ->
  restrict: 'A'
  scope:
    sidebar-item: '=sidebarItem'
    is-group: '=isGroup'
  link: (scope, elem, attr) !->
    is-group = scope.is-group

    template = ''

    if is-group
      template = '<li class="sidebar-header">{{ sidebarItem.name }}</li>
        <li>
           <ul class="nav" ng-repeat="item in sidebarItem.subMenu" is-group="item.isGroup" sidebar-item="item"/></div>
        </li>'
    else
      template = '<li>
         <a href="" my-sref="sidebarItem.sref">
          <span class="glyphicon" ng-class="sidebarItem.icon" ng-show="sidebarItem.icon"></span>
          {{ sidebarItem.name }}
         </a>
       </li>'
    elem.html template
    $compile elem.contents! <| scope

angular
  .module 'app.core'
  .directive 'sidebarItem', sidebar-item
