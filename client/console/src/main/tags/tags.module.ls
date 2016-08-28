'use strict'

config = ($state-provider, Sidebar-menu-provider) !->
  $state-provider
    .state 'app.tags', do
      url: '/tags'
      views:
        'content':
          template-url: 'main/tags/tags.template.html'
          controller: 'TagsController as vm'
      resolve:
        tags: (Tag) ->
          Tag
            .find do
              filter:
                include:
                  relation: 'documents'
                  scope:
                    fields:
                      id: true

    .state 'app.tags.main', do
      url: '/'
      on-enter: ($root-scope, Toolbar) !->

        $ '.tags-list' .remove-class 'split-tag-list col-md-6 visible-md-block visible-lg-block'
        $ '.tag-detail-content' .remove-class 'split-tag-detail'

        Toolbar.config do
          parent:
            text: 'Tag'
            sref: 'app.tags.main'
          buttons:
            * text: 'Add tag'
              class: 'btn-success'
              sref: 'app.tags.new'

  Sidebar-menu-provider.save-item 'content.tags', do
    name: 'Tag'
    sref: 'app.tags.main'
    icon: 'fui-tag'
    weight: 1

angular
  .module 'app.tags', []
  .config config
