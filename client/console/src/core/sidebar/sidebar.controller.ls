'use strict'

Sidebar-controller.$inject = [\$scope,\$rootScope,\$state,\SidebarMenu,\Auth,\BlogSetting ]
function Sidebar-controller  ( $scope, $rootScope, $state, Sidebar-menu, Auth, Blog-setting )
  vm = @

  vm.sidebar-menu = Sidebar-menu.menu

  vm.current-user = Auth.current-user

  vm.blogSetting = Blog-setting.current-setting

  return

angular
  .module \app.core
  .controller 'SidebarController', Sidebar-controller
