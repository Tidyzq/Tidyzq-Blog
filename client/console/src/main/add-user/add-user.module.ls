'use strict'

config = ($state-provider, Sidebar-menu-provider) !->
  $state-provider
    .state 'app.add-user', do
        url: '/add-user',
        views:
          'content':
            template-url: 'main/add-user/add-user.template.html'
            controller: 'AddUserController as vm'

angular
  .module 'app.add-user', []
  .config config
