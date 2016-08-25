'use strict'

config = ($state-provider, Sidebar-menu-provider) !->
  $state-provider
    .state 'app.editor', do
      url: '/editor/:id',
      views:
        'content@app':
          template-url: 'main/editor/editor.template.html'
          controller: 'EditorController as vm'
      resolve:
        document: (Document, $state-params) ->
          Document
            .find-by-id do
              id: $state-params.id
              filter:
                fields:
                  html: false
                include: 'tags'
        all-tags: (Tag) ->
          Tag
            .find do
              filter:
                fields:
                  name: true
                  id: true

angular
  .module 'app.editor', []
  .config config