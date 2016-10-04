'use strict'

Sidebar-controller.$inject = [\$scope,\$rootScope,\$state,\SidebarMenu,\Auth,\BlogSetting,\BlogRender,\Notification ]
function Sidebar-controller  ( $scope, $rootScope, $state, Sidebar-menu, Auth, Blog-setting, Blog-render, Notification )
  vm = @

  vm.sidebar-menu = Sidebar-menu.menu

  vm.current-user = Auth.current-user

  vm.blogSetting = Blog-setting.current-setting

  vm.render = !->
    Blog-render
      .render-all!
      .then !->
        Notification.send 'success', 'Render success'
      .catch !->
        Notification.sned 'danger', 'Render failed'

  return

angular
  .module \app.core
  .controller 'SidebarController', Sidebar-controller
