'use strict'

User-detail-controller = (data, $state, $scope, User) !->
  vm = @

  vm.user = data

  save-role = ->
    console.log vm.user.id
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
          save-role!
        .then !->
          console.log 'success'
        .catch (response) !->
          console.error response

angular
  .module \app.user-detail
  .controller 'UserDetailController', User-detail-controller
