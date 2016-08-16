'use strict'

Add-user-controller = ($state, $scope, $root-scope, User, Auth, Notification) !->
  vm = @

  $root-scope.$broadcast 'config toolbar', do
    parent:
      text: 'User'
      sref: 'app.users'
    child:
      text: 'Add User'
    buttons:
      * text: 'Save'
        class: 'btn-info'

  $scope.$watch 'addUserForm.$invalid', (new-val) !->
    if new-val
      $root-scope.$broadcast 'disable toolbar button', 0
    else
      $root-scope.$broadcast 'enable toolbar button', 0

  $scope.$on 'toolbar button clicked', !->
    # console.log 'click'
    vm.save!

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
