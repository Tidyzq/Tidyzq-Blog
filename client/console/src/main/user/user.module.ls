'use strict'

config = ($state-provider, Sidebar-menu-provider) !->
  $state-provider
    .state 'app.user', {
        url: '/user',
        views:
          'content':
            template-url: 'main/user/user.template.html'
            controller: 'UserController as vm'
        resolve:
          data: (User) ->
            User
              .find {
                filter:
                  include: 'roles'
              }
    }

  Sidebar-menu-provider.save-item {
    state: 'content'
    name: 'Content'
    is-group: true
  }

  Sidebar-menu-provider.save-item {
    state: 'content.user'
    name: 'User'
    sref: 'app.user'
    icon: 'fui-user'
  }

angular
  .module 'app.user', []
  .config config
