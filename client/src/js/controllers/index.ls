angular
  .module \app
  .controller 'IndexController', ['$scope', 'LoopBackAuth', 'User' ($scope, LoopBackAuth, User) !->
    vm = @
    vm.sign-in-user = {}
    vm.sign-up-user = {}

    get-current-user = ->
      user = vm.current-user or {}
      user.id = LoopBackAuth.current-user-id
      user.access-token = LoopBackAuth.access-token-id
      vm.current-user = user
      if user.id
        User
          .getCurrent!
          .$promise
          # .then (response) !->
          #   console.log response
          .catch (response) !->
            # console.log response
            LoopBackAuth.clearUser!
            LoopBackAuth.clearStorage!
            vm.current-user = {}

    get-current-user!

    sign-in-success = (response) !->
      vm.sign-in-user = {}
      $scope.sign-in-form.$setPristine()
      get-current-user!
      $('#sign-in').modal('hide')

    sign-in-fail = (response) !->
      vm.sign-in-fail-msg = response.data.error.message

    vm.sign-in = ->
      vm.sign-in-fail-msg = null
      User
        .login vm.sign-in-user
        .$promise
        .then sign-in-success
        .catch sign-in-fail

    sign-up-success = (response) !->
      vm.sign-in-user = {}
      vm.sign-in-user.username = vm.sign-up-user.username
      # clear sign-up-user
      vm.sign-up-user = {}
      $scope.sign-up-form.$setPristine()
      # close sign up form
      $('#sign-up').modal('hide')
      # open sign in form
      $('#sign-in').modal('show')

    sign-up-fail = (response) !->
      vm.sign-up-fail-msg = response.data.error.message
      console.log vm.sign-up-fail-msg

    vm.hide-sign-up-fail-msg = !->
      vm.sign-up-fail-msg = null

    vm.sign-up = ->
      vm.hide-sign-up-fail-msg!
      sign-up-user = _.cloneDeep(vm.sign-up-user)
      delete sign-up-user.rpassword
      User
        .create sign-up-user
        .$promise
        .then sign-up-success
        .catch sign-up-fail

    vm.logout = ->
      User
        .logout!
        .$promise
        .then (response) ->
          console.log response
        .catch (response) ->
          console.log response
  ]

 # function getTodos() {
   # Todo
     # .find()
     # .$promise
     # .then(function(results) {
       # $scope.todos = results;
     # });
 # }
 # getTodos();
 # $scope.addTodo = function() {
   # Todo
     # .create($scope.newTodo)
     # .$promise
     # .then(function(todo) {
       # $scope.newTodo = '';
       # $scope.todoForm.content.$setPristine();
       # $('.focus').focus();
       # getTodos();
     # });
 # };
 # $scope.removeTodo = function(item) {
   # Todo
     # .deleteById(item)
     # .$promise
     # .then(function() {
       # getTodos();
     # });
 # };
