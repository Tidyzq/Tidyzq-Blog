'use strict'

Document-detail-show-controller = (document, $state, $scope, $element) !->
  vm = @

  vm.document = document

  $scope.$watch 'vm.document.html', !->
    $element.html vm.document.html

angular
  .module \app.document-detail
  .controller 'DocumentDetailShowController', Document-detail-show-controller
