'use strict'

Sidebar-controller = (Sidebar-menu, Auth, Blog-setting) !->
  vm = @

  Sidebar-menu.save-item {
    name: 'test'
    sref: 'app.test'
    icon: 'glyphicon-star'
  }

  vm.sidebar-menu = Sidebar-menu.get-menu!

  vm.current-user = Auth.current-user

  vm.blogSetting = Blog-setting.current-setting

angular
  .module \app.core
  .controller 'SidebarController', Sidebar-controller
