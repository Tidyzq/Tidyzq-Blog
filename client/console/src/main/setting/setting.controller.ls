'use strict'

Setting-controller = ($state, $root-scope, $scope, Blog-setting, Notification, Toolbar, Setting) !->
  vm = @

  watch = ->
    Blog-setting.is-loaded

  $scope.$watch watch, (is-loaded) !->
    if is-loaded
      vm.setting = _.clone-deep Blog-setting.current-setting

  vm.save-logo = !->
    vm.setting.logo = vm.logo

  vm.save-cover = !->
    vm.setting.cover = vm.cover

  Toolbar.on-click = !->
    vm.save-setting!

  $scope.$on '$destroy', !->
    Toolbar.on-click = !-> return

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
