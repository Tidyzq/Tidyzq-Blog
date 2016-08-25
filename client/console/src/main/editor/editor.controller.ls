'use strict'

Editor-controller = (document, all-tags, $state, $scope, $root-scope, Markdown, Notification, Document, Auth) !->

  vm = @

  document
    .$promise
    .then !->
      vm.tags = _.map document.tags, 'id'
      vm.org-tags = _.clone-deep vm.tags
      $root-scope.$broadcast 'config toolbar', do
        input:
          text: document.title
          placeholder: 'Title'
        buttons:
          * icon: 'fui-gear'
            class: 'btn-empty'
          * text: 'Save'
            class: 'btn-info'

  vm.document = document
  vm.all-tags = all-tags

  $scope.image-type-switch = true

  $scope.$watch 'vm.document.markdown', !->
    html = Markdown.render vm.document.markdown

    $ '.editor-html' .html html

  $scope.$on 'toolbar input changed', (event, input) !->
    vm.document.title = input

  $scope.$on 'toolbar button clicked', (event, index) !->
    switch index
    case 0
      $ '#editor-setting' .collapse 'toggle'
    case 1
      vm.save-document!

  vm.save-image = !->
    vm.document.image = vm.image

  add-tag = (tagId) ->
    Document
      .tags.link do
        id: vm.document.id
        fk: tagId
        {}
      .$promise

  delete-tag = (tagId) ->
    Document
      .tags.unlink do
        id: vm.document.id
        fk: tagId
        {}
      .$promise

  solve-tags = ->
    add-tags = _.difference vm.tags, vm.org-tags
    delete-tags = _.difference vm.org-tags, vm.tags
    # console.log 'add', add-tags
    # console.log 'delete', delete-tags
    promises = _.concat (_.map add-tags, add-tag), (_.map delete-tags, delete-tag)
    Promise.all promises

  vm.save-document = !->
    vm.document.updated-at = new Date! .to-ISO-string!
    vm.document.updated-by = Auth.current-user.id
    console.log vm.document
    Document
      .prototype$update-attributes vm.document
      .$promise
      .then solve-tags
      .then !->
        # clone to avoid multi add and delete
        vm.tags = _.clone-deep vm.org-tags
        Notification.send 'success', 'Save success'
      .catch (response) !->
        # console.log response
        Notification.send 'danger', response.data.error.message


angular
  .module \app.editor
  .controller 'EditorController', Editor-controller
