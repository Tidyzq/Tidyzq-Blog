'use strict'

Tag-detail-controller.$inject = [\tag,\$state,\$scope,\$rootScope,\Notification,\Tag,\Toolbar ]
function Tag-detail-controller  ( tag, $state, $scope, $root-scope, Notification, Tag, Toolbar )

  vm = @

  $ '.tags-list' .add-class 'split-tag-list col-md-6 visible-md-block visible-lg-block'
  $ '.tag-detail-content' .add-class 'split-tag-detail'

  tag
    .$promise
    .then !->

      vm.image = vm.tag.image

      Toolbar.config do
        parent:
          text: 'Tag'
          sref: 'app.tags.main'
        child:
          text: tag.name
        buttons:
          * text: 'Save'
            class: 'btn-success'

  vm.tag = tag

  Toolbar.on-click = !->
    save-tag!

  $scope.$on '$destroy', !->
    Toolbar.on-click = !-> return

  reload-tags = !->
    $root-scope.$broadcast 'reload'

  save-tag = !->
    Tag
      .prototype$updateAttributes vm.tag
      .$promise
      .then !->
        reload-tags!
        Notification.send 'success', 'Save success'
      .catch (response) !->
        Notification.send 'danger', response.data.error.message

  vm.save-image = !->
    vm.tag.image = vm.image

  vm.delete-tag = !->
    Tag
      .delete-by-id vm.tag
      .$promise
      .then !->
        reload-tags!
        $state.go 'app.tags.main'
        Notification.send 'danger', 'Delete success'
      .catch (response) !->
        Notification.send 'danger', response.data.error.message

  return

angular
  .module \app.tag-detail
  .controller 'TagDetailController', Tag-detail-controller
