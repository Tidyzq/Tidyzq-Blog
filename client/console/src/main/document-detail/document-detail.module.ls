'use strict'

config = ($state-provider, Sidebar-menu-provider) !->
  $state-provider
    .state 'app.document-detail', {
        url: '/document/:id',
        views:
          'content':
            template-url: 'main/document-detail/document-detail.template.html'
            controller: 'DocumentDetailController as vm'
          'heading@app.document-detail':
            template-url: 'main/document-detail/document-detail.heading.html'
          'list@app.document-detail':
            template-url: 'main/documents/documents.list.html'
            controller: 'DocumentsController as vm'
          'detail@app.document-detail':
            controller: 'DocumentDetailShowController as vm'
        resolve:
          document: (Document, $state-params) ->
            Document
              .find-by-id {
                id: $state-params.id
                filter:
                  include: 'author'
              }
          documents: (Document) ->
            Document
              .find {
                filter:
                  include: 'author'
              }
    }


angular
  .module 'app.document-detail', []
  .config config
