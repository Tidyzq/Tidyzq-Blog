'use strict'

Logout-controller = (data, $state, $scope) !->
  vm = @

  data!
    .then !->
      $state.go 'login'
    .catch !->
      $state.go 'login'

angular
  .module \app.logout
  .controller 'LogoutController', Logout-controller
