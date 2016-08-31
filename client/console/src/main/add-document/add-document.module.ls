'use strict'

config = ($state-provider, Sidebar-menu-provider) !->
  $state-provider
    .state 'app.add-document', do
      url: '/add-document',
      views:
        'content@app':
          template-url: '/console/main/add-document/add-document.template.html'
          controller: 'AddDocumentController as vm'
      resolve:
        all-tags: (Tag) ->
          Tag
            .find do
              filter:
                fields:
                  name: true
                  id: true

      on-enter: (Toolbar) !->
        Toolbar.config do
          input:
            text: ''
            placeholder: 'Title'
          buttons:
            * icon: 'fui-gear'
              class: 'btn-empty'
            * text: 'Save'
              class: 'btn-info'

angular
  .module 'app.add-document', []
  .config config
