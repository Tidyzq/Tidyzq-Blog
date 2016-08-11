'use strict'

Login-controller = (Auth) !->
  vm = @

  vm.login = !->
    Auth.log-in vm.login-user

  vm.user = Auth.current-user

angular
  .module \app.login
  .controller 'LoginController', Login-controller
