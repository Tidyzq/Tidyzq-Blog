'use strict'

Login-controller.$inject = [\$state,\$scope,\$interval,\Auth ]
function Login-controller  ( $state, $scope, $interval, Auth )
  vm = @

  vm.login = !->
    # console.log('login');
    if (vm.email-or-username.search '@') is -1
      vm.login-user.username = vm.email-or-username
    else
      vm.login-user.email = vm.email-or-username
    Auth.log-in vm.login-user
      .then !->
        # console.log('success');
        $state.go 'app.documents'
      .catch (response) !->
        # console.log('failed');
        console.error(response);
        $scope.login-form.password.$invalid = true

  $scope.$watch 'Auth.isLogedIn' (newValue, oldValue) !->
    if newValue
      $state.go 'app.documents.main'

  return

angular
  .module \app.login
  .controller 'LoginController', Login-controller
