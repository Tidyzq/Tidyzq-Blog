'use strict'

User-detail-controller = (data, $state, $scope, User, Auth, Notification) !->
  vm = @

  vm.user = data

  save-role = ->
    if not _.includes vm.user.roles, 'admin'
      User
        .prototype$delete-role-by-id {
          id: vm.user.id
          role-name: 'admin'
        }
        .$promise
    else if _.includes vm.user.roles, 'admin'
      User
        .prototype$add-roles-by-id {
          id: vm.user.id
          role-names: ['admin']
        }
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

  vm.delete = !->
    if not $scope.delete-form.$invalid
      User
        .delete-by-id {
          id: vm.user.id
        }
        .$promise
        .then !->
          Notification.send 'danger', 'Delete success'
          $state.go 'app.users'
        .catch (response) !->
          Notification.send 'danger', response.data.error.message

angular
  .module \app.user-detail
  .controller 'UserDetailController', User-detail-controller
