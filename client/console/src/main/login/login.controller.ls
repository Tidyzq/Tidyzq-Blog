'use strict'

Login-controller = ($state, $scope, Auth) !->
  vm = @

  vm.login = !->
    Auth.log-in vm.login-user
      .then !->
        $state.go 'app.main'
      .catch (response) !->
        $scope.login-form.password.$invalid = true

  $scope.$watch 'Auth.isLogedIn' (newValue, oldValue) !->
    if newValue
      $state.go 'app.main'

angular
  .module \app.login
  .controller 'LoginController', Login-controller
