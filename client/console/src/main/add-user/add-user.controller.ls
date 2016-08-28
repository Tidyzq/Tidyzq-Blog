'use strict'

Add-user-controller = ($state, $scope, $root-scope, User, Auth, Notification, Toolbar) !->
  vm = @

  $ '#avatar-input-modal' .on 'shown.bs.modal' !->
    vm.avatar = vm.user.avatar
    $scope.$digest!

  vm.user = {}

  $scope.$watch 'addUserForm.$invalid', (new-val) !->
    Toolbar.enable-btn 0, !new-val

  Toolbar.on-click = !->
    vm.save!

  $scope.$on '$destroy', !->
    Toolbar.on-click = !-> return

  save-role = ->
    if not _.includes vm.user.roles, 'admin'
      User
        .prototype$deleteRoleById do
          id: vm.user.id
          role-name: 'admin'
        .$promise
    else if _.includes vm.user.roles, 'admin'
      User
        .prototype$addRolesById do
          id: vm.user.id
          role-names: ['admin']
        .$promise
    else
      Promise.resolve!

  vm.save-avatar = !->
    vm.user.avatar = vm.avatar

  vm.save = !->
    if not $scope.add-user-form.$invalid
      User
        .create vm.user
        .$promise
        .then (response) ->
          vm.user.id = response.id
          if Auth.is-admin!
            save-role!
        .then !->
          Notification.send 'success', 'Save success'
          $state.go 'app.users'
        .catch (response) !->
          Notification.send 'danger', response.data.error.message

angular
  .module \app.add-user
  .controller 'AddUserController', Add-user-controller
