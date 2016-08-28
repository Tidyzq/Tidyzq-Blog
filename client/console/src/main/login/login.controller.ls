'use strict'

Login-controller = ($state, $scope, $interval, Auth) !->
  vm = @

  vm.login = !->
    Auth.log-in vm.login-user
      .then !->
        $state.go 'app.documents'
      .catch (response) !->
        $scope.login-form.password.$invalid = true

  $scope.$watch 'Auth.isLogedIn' (newValue, oldValue) !->
    if newValue
      $state.go 'app.documents.main'

angular
  .module \app.login
  .controller 'LoginController', [ \$state \$scope \$interval \Auth Login-controller ]
