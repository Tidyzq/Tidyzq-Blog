'use strict'

Logout-controller = (data, $state, $scope, Notification) !->
  vm = @

  data!
    .then !->
      $state.go 'login'
      Notification.send 'success', 'Log out success'
    .catch !->
      $state.go 'login'

angular
  .module \app.logout
  .controller 'LogoutController', Logout-controller
