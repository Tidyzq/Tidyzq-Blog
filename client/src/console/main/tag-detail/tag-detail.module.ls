'use strict'

config.$inject = [\$stateProvider,\SidebarMenuProvider ]
function config  ( $state-provider, Sidebar-menu-provider )
  $state-provider
    .state 'app.tags.detail', do
        url: '/detail/:id',
        views:
          'detail@app.tags':
            controller: 'TagDetailController as vm'
            template-url: 'console/main/tag-detail/tag-detail.template.html'
        resolve:
          tag: [\Tag \$stateParams (Tag, $state-params) ->
            Tag
              .find-by-id do
                id: $state-params.id
          ]

  return

angular
  .module 'app.tag-detail', []
  .config config
