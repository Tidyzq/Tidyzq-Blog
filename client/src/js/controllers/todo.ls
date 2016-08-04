todo-controller = (dataSource, $scope, $state, Todo, LoopBackAuth) !->

  vm = @
  vm.todos = []

  vm.get-todos = !->
    dataSource!
      .then (results) !->
        vm.todos = results

  vm.addTodo = !->
    Todo
      .create vm.new-todo
      .$promise
      .then (todo) !->
        vm.new-todo = ''
        $scope.todo-form.$set-pristine!
        $('.focus').focus!
        vm.get-todos!

  vm.remove-todo = (item) !->
    Todo
      .delete-by-id item
      .$promise
      .then !->
        vm.get-todos!

  vm.get-todos!

angular
  .module \app
  .controller 'TodoController', todo-controller
