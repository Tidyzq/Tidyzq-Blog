'use strict'

Editor-controller.$inject = [\document,\allTags,\$state,\$scope,\$rootScope,\Markdown,\Notification,\Document,\Auth,\Toolbar ]
function Editor-controller  ( document, all-tags, $state, $scope, $root-scope, Markdown, Notification, Document, Auth, Toolbar )

  vm = @

  document
    .$promise
    .then !->

      vm.tags = _.map document.tags, 'id'
      vm.org-tags = _.clone-deep vm.tags
      vm.image = vm.document.image

      Toolbar.config do
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

  Toolbar.input-changed = (input) !->
    vm.document.title = input

  Toolbar.on-click = (index) !->
    switch index
    case 0
      $ '#editor-setting' .collapse 'toggle'
    case 1
      vm.save-document!

  $scope.$on '$destroy', !->
    Toolbar.on-click = !-> return
    Toolbar.input-changed = !-> return

  $scope.$watch 'editorSettingForm.$invalid', (new-value) !->
    Toolbar.enable-btn 1, !new-value

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

  vm.delete-document = !->
    Document
      .delete-by-id vm.document
      .$promise
      .then !->
        Notification.send 'danger', 'Delete success'
        $state.go 'app.documents.main'
      .catch (response) !->
        # console.log response
        Notification.send 'danger', response.data.error.message

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
        vm.org-tags = _.clone-deep vm.tags
        Notification.send 'success', 'Save success'
      .catch (response) !->
        # console.log response
        Notification.send 'danger', response.data.error.message

  return

angular
  .module \app.editor
  .controller 'EditorController', Editor-controller
