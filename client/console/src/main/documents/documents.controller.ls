'use strict'

Documents-controller = (documents, $state, $scope, $root-scope) !->

  vm = @

  $root-scope.$broadcast 'config toolbar', do
    parent:
      text: 'Document'
      sref: 'app.documents.main'
    buttons:
      * text: 'Add document'
        class: 'btn-success'

  vm.documents = documents

  $scope.from-now = (date) ->
    moment date .from-now!

  vm.detail = (document) !->
    $state.go 'app.documents.detail', document

  vm.edit = (document) !->
    console.log document
    $state.go 'app.editor', document

angular
  .module \app.documents
  .controller 'DocumentsController', Documents-controller
