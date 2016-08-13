'use strict'

config = ($state-provider, Sidebar-menu-provider) !->
  $state-provider
    .state 'app.users', {
        url: '/users',
        views:
          'content':
            template-url: 'main/users/users.template.html'
            controller: 'UsersController as vm'
        resolve:
          data: (User) ->
            User
              .find {
                filter:
                  include: 'roles'
              }
    }

  Sidebar-menu-provider.save-item 'content', {
    name: 'Content'
    is-group: true
  }

  Sidebar-menu-provider.save-item 'content.users', {
    name: 'User'
    sref: 'app.users'
    icon: 'fui-user'
    require-admin: true
  }

angular
  .module 'app.users', []
  .config config
