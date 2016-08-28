'use strict'

config = ($state-provider, Sidebar-menu-provider) !->
  $state-provider
    .state 'app.tags.new', do
      url: '/new'
      views:
        'detail@app.tags':
          controller: 'AddTagController as vm'
          template-url: 'main/add-tag/add-tag.template.html'
      on-enter: (Toolbar) !->
        Toolbar.config do
          parent:
            text: 'Tag'
            sref: 'app.tags.main'
          child:
            text: 'new'
          buttons:
            * text: 'Save'
              class: 'btn-success'

angular
  .module 'app.add-tag', []
  .config config
