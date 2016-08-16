'use strict'

config = ($state-provider, Sidebar-menu-provider) !->
  $state-provider
    .state 'app.documents', do
      url: '/documents'
      views:
        'content':
          template-url: 'main/documents/documents.template.html'
          controller: 'DocumentsController as vm'
      resolve:
        documents: (Document) ->
          Document
            .find do
              filter:
                fields:
                  html: false
                  markdown: false
                include: 'author'

    .state 'app.documents.main', do
      url: '/'
      onEnter: ($root-scope) !->
        $ '.documents-list' .remove-class 'split-document-list col-md-4 visible-md-block visible-lg-block'
        $ '.document-detail-content' .remove-class 'split-document-detail'

        $root-scope.$broadcast 'config toolbar', do
          parent:
            text: 'Document'
            sref: 'app.documents.main'
          buttons:
            * text: 'Add document'
              class: 'btn-success'

  Sidebar-menu-provider.save-item 'content.documents', do
    name: 'Document'
    sref: 'app.documents.main'
    icon: 'fui-document'
    weight: 1

angular
  .module 'app.documents', []
  .config config
