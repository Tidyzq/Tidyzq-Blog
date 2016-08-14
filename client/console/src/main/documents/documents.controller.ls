'use strict'

Documents-controller = (documents, $state, $scope) !->
  vm = @

  vm.documents = documents

  $scope.from-now = (date) ->
    moment date .from-now!

angular
  .module \app.documents
  .controller 'DocumentsController', Documents-controller
