'use strict'

config = ($state-provider, Sidebar-menu-provider) !->
  $state-provider
    .state 'app.add-user', do
        url: '/add-user',
        views:
          'content':
            template-url: 'main/add-user/add-user.template.html'
            controller: 'AddUserController as vm'

        on-enter: (Toolbar) ->
          Toolbar.config do
            parent:
              text: 'User'
              sref: 'app.users'
            child:
              text: 'Add User'
            buttons:
              * text: 'Save'
                class: 'btn-info'

angular
  .module 'app.add-user', []
  .config config
