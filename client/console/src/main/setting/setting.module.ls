'use strict'

config.$inject = [\$stateProvider,\SidebarMenuProvider ]
function config  ( $state-provider, Sidebar-menu-provider )
  $state-provider
    .state 'app.setting', do
      url: '/setting'
      views:
        'content@app':
          controller: 'SettingController as vm'
          template-url: 'console/main/setting/setting.template.html'
      on-enter: [\Toolbar (Toolbar) !->
        Toolbar.config do
          parent:
            text: 'Setting'
            sref: 'app.setting'
          buttons:
            * text: 'Save'
              class: 'btn-success'
      ]

  Sidebar-menu-provider.save-item 'setting', do
    name: 'Setting'
    is-group: true
    require-admin: true

  Sidebar-menu-provider.save-item 'setting.general', do
    name: 'General'
    sref: 'app.setting'
    icon: 'fui-cmd'
    require-admin: true

  return

angular
  .module 'app.setting', []
  .config config
