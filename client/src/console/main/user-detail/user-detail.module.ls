'use strict'

config.$inject = [\$stateProvider,\SidebarMenuProvider ]
function config  ( $state-provider, Sidebar-menu-provider )
  $state-provider
    .state 'app.user-detail', do
        url: '/user/:id',
        views:
          'content':
            template-url: 'console/main/user-detail/user-detail.template.html'
            controller: 'UserDetailController as vm'
        resolve:
          data: [\User \$stateParams (User, $state-params) ->
            User
              .findById do
                id: $state-params.id
                filter:
                  include: 'roles'
          ]

  Sidebar-menu-provider.save-item 'user.profile', do
    name: 'Profile'
    sref: 'app.user-detail(Auth.currentUser)'
    icon: 'fui-new'

  return

angular
  .module 'app.user-detail', []
  .config config
