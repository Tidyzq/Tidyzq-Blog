'use strict'

sidebar-item = ($compile) ->
  restrict: 'A'
  scope:
    sidebar-item: '='
  link: (scope, elem, attr) !->
    is-group = scope.sidebar-item.is-group
    require-admin = scope.sidebar-item.require-admin

    template = ''
    ng-show = ''

    if require-admin
      ng-show = ' ng-show="Auth.isAdmin(Auth.currentUser)"'

    if is-group
      template = '<li class="sidebar-header"' + ng-show + '>{{ sidebarItem.name }}</li>
        <li' + ng-show + '>
           <ul class="nav" ng-repeat="item in sidebarItem.subMenu" sidebar-item="item"/></ul>
        </li>'
    else
      template = '<li' + ng-show + '>
         <a href="" my-sref="sidebarItem.sref">
          <span class="glyphicon" ng-class="sidebarItem.icon" ng-show="sidebarItem.icon"></span>
          {{ sidebarItem.name }}
         </a>
       </li>'
    elem.html template
    scope.Auth = scope.$root.Auth
    $compile elem.contents! <| scope

angular
  .module 'app.core'
  .directive 'sidebarItem', sidebar-item
