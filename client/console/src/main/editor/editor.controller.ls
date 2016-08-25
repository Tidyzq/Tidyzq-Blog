'use strict'

Editor-controller = (document, all-tags, $state, $scope, $root-scope, Markdown) !->

  vm = @

  document
    .$promise
    .then !->
      vm.tags = _.map document.tags, 'id'
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

  $scope.$watch 'vm.document.markdown', !->
    html = Markdown.render vm.document.markdown

    $ '.editor-html' .html html

  $scope.$on 'toolbar input changed', (event, input) !->
    vm.document.title = input

  $scope.$on 'toolbar button clicked', (event, index) !->
    switch index
    case 0
      $ '#editor-setting' .collapse 'toggle'

  vm.save-image = !->
    vm.document.image = vm.image

angular
  .module \app.editor
  .controller 'EditorController', Editor-controller
