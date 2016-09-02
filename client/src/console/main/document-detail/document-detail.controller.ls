'use strict'

Document-detail-controller.$inject = [\document,\$state,\$scope,\$rootScope,\$element,\Auth,\Toolbar ]
function Document-detail-controller  ( document, $state, $scope, $root-scope, $element, Auth, Toolbar )

  vm = @

  $ '.documents-list' .add-class 'split-document-list col-md-4 visible-md-block visible-lg-block'
  $ '.document-detail-content' .add-class 'split-document-detail'

  document
    .$promise
    .then !->
      Toolbar.config do
        parent:
          text: 'Document'
          sref: 'app.documents.main'
        child:
          text: document.title
        buttons:
          * text: 'Edit'
            class: 'btn-info'
            disabled: not Auth.is-admin! and Auth.current-user.id is not document.author.id

  vm.document = document

  $scope.$watch 'vm.document.html', !->
    $element.html vm.document.html

  Toolbar.on-click = !->
    $state.go 'app.editor', document

  $scope.$on '$destroy', !->
    Toolbar.on-click = !-> return

  return

angular
  .module \app.document-detail
  .controller 'DocumentDetailController', Document-detail-controller
