'use strict'

config = ($state-provider, Sidebar-menu-provider) !->
  $state-provider
    .state 'app.documents', {
        url: '/documents',
        views:
          'content':
            template-url: 'main/documents/documents.template.html'
            controller: 'DocumentsController as vm'
          'heading@app.documents':
            template-url: 'main/documents/documents.heading.html'
          'list@app.documents':
            template-url: 'main/documents/documents.list.html'
        resolve:
          documents: (Document) ->
            Document
              .find {
                filter:
                  include: 'author'
              }
    }

  Sidebar-menu-provider.save-item 'content.documents', {
    name: 'Document'
    sref: 'app.documents'
    icon: 'fui-document'
    weight: 1
  }

angular
  .module 'app.documents', []
  .config config
