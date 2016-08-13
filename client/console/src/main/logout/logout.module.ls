'use strict'

config = ($state-provider, Sidebar-menu-provider) !->
  $state-provider
    .state 'logout', {
        url: '/logout',
        views:
          'main':
            controller: 'LogoutController as vm'
        resolve:
          data: (Auth) ->
            ->
              Auth
                .log-out!
    }

  Sidebar-menu-provider.save-item 'user', {
    name: 'User'
    is-group: true
    weight: 99
  }

  Sidebar-menu-provider.save-item 'user.logout', {
    name: 'Log out'
    sref: 'logout'
    icon: 'fui-exit'
    weight: 99
  }

angular
  .module 'app.logout', []
  .config config
