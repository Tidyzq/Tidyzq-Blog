'use strict'

Document-detail-controller = (document, $state, $scope, $element) !->
  vm = @

  vm.document = document

angular
  .module \app.document-detail
  .controller 'DocumentDetailController', Document-detail-controller
