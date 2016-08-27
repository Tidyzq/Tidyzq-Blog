'use strict'

User-detail-controller = (data, $state, $scope, $root-scope, User, Auth, Notification, Toolbar) !->
  vm = @

  data
    .$promise
    .then !->
      Toolbar.config do
        parent:
          text: 'User'
          sref: 'app.users'
          need-admin: true
        child:
          text: data.username
        buttons:
          * text: 'Save'
            class: 'btn-info'


  $scope.$watch 'userDetailForm.$invalid', (new-val) !->
    Toolbar.enable-btn 0, !new-val

  Toolbar.on-click = !->
    vm.save!

  $ '#avatar-input-modal' .on 'shown.bs.modal' !->
    vm.avatar = vm.user.avatar
    $scope.$digest!

  vm.user = data

  save-role = ->
    if not _.includes vm.user.roles, 'admin'
      User
        .prototype$delete-role-by-id do
          id: vm.user.id
          role-name: 'admin'
        .$promise
    else if _.includes vm.user.roles, 'admin'
      User
        .prototype$add-roles-by-id do
          id: vm.user.id
          role-names: ['admin']
        .$promise
    else
      Promise.resolve!


  vm.save = !->
    if not $scope.user-detail-form.$invalid
      User
        .prototype$update-attributes vm.user
        .$promise
        .then ->
          if Auth.is-admin!
            save-role!
        .then !->
          Notification.send 'success', 'Save success'
        .catch (response) !->
          Notification.send 'danger', response.data.error.message

  vm.save-avatar = !->
    vm.user.avatar = vm.avatar

  vm.delete = !->
    if not $scope.delete-form.$invalid
      User
        .delete-by-id do
          id: vm.user.id
        .$promise
        .then !->
          Notification.send 'danger', 'Delete success'
          $state.go 'app.users'
        .catch (response) !->
          Notification.send 'danger', response.data.error.message

angular
  .module \app.user-detail
  .controller 'UserDetailController', User-detail-controller
