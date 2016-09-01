'use strict'

Logout-controller.$inject = [\data,\$state,\$scope,\Notification ]
function Logout-controller  ( data, $state, $scope, Notification )
  vm = @

  data!
    .then !->
      $state.go 'login'
      Notification.send 'success', 'Log out success'
    .catch !->
      $state.go 'login'

  return

angular
  .module \app.logout
  .controller 'LogoutController', Logout-controller
