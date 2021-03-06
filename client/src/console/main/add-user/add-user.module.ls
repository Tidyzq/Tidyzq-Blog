'use strict'

config.$inject = [\$stateProvider,\SidebarMenuProvider ]
function config  ( $state-provider, Sidebar-menu-provider )
  $state-provider
    .state 'app.add-user', do
        url: '/add-user',
        views:
          'content':
            template-url: 'console/main/add-user/add-user.template.html'
            controller: 'AddUserController as vm'

        on-enter: [\Toolbar (Toolbar) ->
          Toolbar.config do
            parent:
              text: 'User'
              sref: 'app.users'
            child:
              text: 'Add User'
            buttons:
              * text: 'Save'
                class: 'btn-info'
        ]

  return

angular
  .module 'app.add-user', []
  .config config
