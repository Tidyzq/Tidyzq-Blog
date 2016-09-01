'use strict'

config.$inject = [\$stateProvider, \SidebarMenuProvider ]
function config  ( $state-provider, Sidebar-menu-provider )
  $state-provider
    .state 'login', do
        url: '/console/login',
        views:
          'main':
            template-url: 'console/main/login/login.template.html'
            controller : 'LoginController as vm'

  return

angular
  .module 'app.login', []
  .config config
