'use strict'

config.$inject = [\$stateProvider,\SidebarMenuProvider ]
function config  ( $state-provider, Sidebar-menu-provider )
  $state-provider
    .state 'logout', do
        url: '/console/logout',
        views:
          'main':
            controller: 'LogoutController as vm'
        resolve:
          data: [\Auth (Auth) ->
            ->
              Auth
                .log-out!
          ]

  Sidebar-menu-provider.save-item 'user', do
    name: 'User'
    is-group: true
    weight: 99

  Sidebar-menu-provider.save-item 'user.logout', do
    name: 'Log out'
    sref: 'logout'
    icon: 'fui-exit'
    weight: 99

  return

angular
  .module 'app.logout', []
  .config config
