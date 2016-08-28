'use strict'

Add-tag-controller = ($state, $scope, $root-scope, Notification, Tag, Toolbar) !->

  vm = @

  $ '.tags-list' .add-class 'split-tag-list col-md-6 visible-md-block visible-lg-block'
  $ '.tag-detail-content' .add-class 'split-tag-detail'

  vm.tag = {}

  Toolbar.on-click = !->
    save-tag!

  $scope.$on '$destroy', !->
    Toolbar.on-click = !-> return

  reload-tags = !->
    $root-scope.$broadcast 'reload'

  save-tag = !->
    Tag
      .create vm.tag
      .$promise
      .then (response) !->
        reload-tags!
        Notification.send 'success', 'Save success'
        $state.go 'app.tags.detail', response
      .catch (response) !->
        Notification.send 'danger', response.data.error.message

  vm.save-image = !->
    vm.tag.image = vm.image

angular
  .module \app.add-tag
  .controller 'AddTagController', Add-tag-controller
