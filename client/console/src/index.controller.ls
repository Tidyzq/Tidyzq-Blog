'use strict'

index-controller = ($scope, Auth, User) !->
  vm = @
  # vm.sign-in-user = {}
  # vm.sign-up-user = {}
  # vm.current-user = Auth.current-user

  # get-user = ->
  #   Auth.get-user!

  # sign-in-success = (response) !->
  #   # console.log response
  #   vm.sign-in-user = {}
  #   $scope.sign-in-form.$set-pristine()
  #   # vm.current-user = response.user
  #   $('#sign-in').modal('hide')

  # sign-in-fail = (response) !->
  #   vm.sign-in-fail-msg = response.data.error.message

  # vm.sign-in = ->
  #   # vm.sign-in-fail-msg = null
  #   # data = _.assign-in vm.sign-in-user, { include: 'user' }
  #   Auth
  #     .sign-in vm.sign-in-user
  #     .then sign-in-success, sign-in-fail

  # sign-up-success = (response) !->
  #   vm.sign-in-user = {}
  #   vm.sign-in-user.username = vm.sign-up-user.username
  #   # clear sign-up-user
  #   vm.sign-up-user = {}
  #   $scope.sign-up-form.$set-pristine()
  #   # close sign up form
  #   $('#sign-up').modal('hide')
  #   # open sign in form
  #   $('#sign-in').modal('show')

  # sign-up-fail = (response) !->
  #   vm.sign-up-fail-msg = response.data.error.message
  #   console.log vm.sign-up-fail-msg

  # vm.hide-sign-up-fail-msg = !->
  #   vm.sign-up-fail-msg = null

  # vm.sign-up = ->
  #   vm.hide-sign-up-fail-msg!
  #   sign-up-user = _.clone-deep(vm.sign-up-user)
  #   delete sign-up-user.rpassword
  #   User
  #     .create sign-up-user
  #     .$promise
  #     .then sign-up-success
  #     .catch sign-up-fail

  # vm.log-out = ->
  #   Auth
  #     .log-out!

angular
  .module \blog
  .controller 'IndexController', index-controller
