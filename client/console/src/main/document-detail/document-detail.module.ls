'use strict'

config.$inject = [\$stateProvider,\SidebarMenuProvider ]
function config  ( $state-provider, Sidebar-menu-provider )
  $state-provider
    .state 'app.documents.detail', do
        url: '/:id',
        views:
          'detail':
            controller: 'DocumentDetailController as vm'
        resolve:
          document: [\Document \$stateParams (Document, $state-params) ->
            Document
              .find-by-id do
                id: $state-params.id
                filter:
                  fields:
                    markdown: false
                  include: 'author'
          ]

  return

angular
  .module 'app.document-detail', []
  .config config
