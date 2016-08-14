'use strict'

Add-user-controller = ($state, $scope, User, Auth, Notification) !->
  vm = @

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
