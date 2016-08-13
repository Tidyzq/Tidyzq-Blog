'use strict'

User-detail-controller = (data, $state, $scope, User, Auth, Notification) !->
  vm = @

  vm.user = data

  save-role = ->
    if not _.includes vm.user.roles, 'admin'
      User
        .prototype$deleteRoleById {
          id: vm.user.id
          role-name: 'admin'
        }
        .$promise
    else if _.includes vm.user.roles, 'admin'
      User
        .prototype$addRolesById {
          id: vm.user.id
          role-names: ['admin']
        }
        .$promise
    else
      Promise.resolve!


  vm.save = !->
    if not $scope.user-detail-form.$invalid
      User
        .prototype$updateAttributes vm.user
        .$promise
        .then ->
          if Auth.is-admin!
            save-role!
        .then !->
          Notification.send 'success', 'Save success'
        .catch (response) !->
          Notification.send 'danger', response.data.error.message

angular
  .module \app.user-detail
  .controller 'UserDetailController', User-detail-controller
