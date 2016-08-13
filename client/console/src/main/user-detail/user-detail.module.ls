'use strict'

config = ($state-provider, Sidebar-menu-provider) !->
  $state-provider
    .state 'app.user-detail', {
        url: '/user/:id',
        views:
          'content':
            template-url: 'main/user-detail/user-detail.template.html'
            controller: 'UserDetailController as vm'
        resolve:
          data: (User, $state-params) ->
            User
              .findById {
                id: $state-params.id
                filter:
                  include: 'roles'
              }
    }

angular
  .module 'app.user-detail', []
  .config config
