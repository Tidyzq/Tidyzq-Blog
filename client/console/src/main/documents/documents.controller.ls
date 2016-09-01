'use strict'

Documents-controller.$inject = [\documents,\$state,\$scope,\$rootScope ]
function Documents-controller  ( documents, $state, $scope, $root-scope )

  vm = @

  vm.documents = documents

  $scope.from-now = (date) ->
    moment date .from-now!

  vm.detail = (document) !->
    $state.go 'app.documents.detail', document

  vm.edit = (document) !->
    console.log document
    $state.go 'app.editor', document

  return

angular
  .module \app.documents
  .controller 'DocumentsController', Documents-controller
