'use strict'

Setting-controller = ($state, $root-scope, $scope, Blog-setting, Notification, Toolbar, Setting) !->
  vm = @

  watch = ->
    Blog-setting.is-loaded

  $scope.$watch watch, (is-loaded) !->
    if is-loaded
      vm.setting = _.clone-deep Blog-setting.current-setting
      vm.logo = vm.setting.logo
      vm.cover = vm.setting.cover

  vm.save-logo = !->
    vm.setting.logo = vm.logo

  vm.save-cover = !->
    vm.setting.cover = vm.cover

  Toolbar.on-click = !->
    vm.save-setting!

  $scope.$on '$destroy', !->
    Toolbar.on-click = !-> return

  vm.add-navigation-item = !->
    vm.setting.navigation.push do
      label: ''
      url: ''

  vm.delete-navigation-item = (item) !->
    index = vm.setting.navigation.index-of item
    vm.setting.navigation.splice index, 1

  array-move = (array, old-index, new-index) ->
    if new-index >= array.length
      k = new-index - array.length
      while (k--) + 1
        array.push undefined
    array.splice new-index, 0, (array.splice old-index, 1)[0]
    array

  vm.on-drag-start = ($item, $container, $super) !->
    vm.drag-index = $item.index!
    # console.log vm.drag-index
    $super $item, $container

  vm.on-drop = ($item, $container, $super) !->
    new-index = $item.index!
    org-index = vm.drag-index
    # console.log new-index
    $super $item, $container
    array-move vm.setting.navigation, org-index, new-index

  vm.save-setting = ->
    temp = _.map vm.setting, (value, key) ->
      key: key
      value: value

    promises = _.map temp, (item) ->
      Setting.upsert item .$promise

    Promise
      .all promises
      .then !->
        Blog-setting.get-settings!
        Notification.send 'success', 'Save success'
      .catch (response) !->
        Notification.send 'danger', response.data.error.message

angular
  .module \app.setting
  .controller 'SettingController', Setting-controller
