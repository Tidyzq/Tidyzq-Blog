'use strict'

Add-document-controller = (all-tags, $state, $scope, $root-scope, Markdown, Notification, Document, Auth, Toolbar) !->

  vm = @

  vm.document =
    markdown: ''
    author-id: Auth.current-user.id
    created-at: new Date! .to-ISO-string!
    is-page: false
    status: 'draft'

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

  $scope.$watch 'vm.document.title', (new-value) !->
    Toolbar.enable-btn 1, !!new-value

  vm.save-image = !->
    vm.document.image = vm.image

  add-tag = (tagId) ->
    Document
      .tags.link do
        id: vm.document.id
        fk: tagId
        {}
      .$promise

  solve-tags = ->
    promises = _.map vm.tags, add-tag
    Promise.all promises

  vm.save-document = !->
    vm.document.updated-at = new Date! .to-ISO-string!
    vm.document.updated-by = Auth.current-user.id
    console.log vm.document
    Document
      .prototype$update-attributes vm.document
      .$promise
      .then (response) ->
        vm.document = _.extend vm.document, response
        solve-tags!
      .then !->
        # clone to avoid multi add and delete
        Notification.send 'success', 'Save success'
        $state.go 'app.editor', vm.document
      .catch (response) !->
        # console.log response
        Notification.send 'danger', response.data.error.message


angular
  .module \app.add-document
  .controller 'AddDocumentController', Add-document-controller
