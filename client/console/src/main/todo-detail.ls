todo-detail-controller = (dataSource, $scope, $state, Todo) !->

  vm = @
  vm.todo = {}

  vm.get-todo = !->
    dataSource!
      .then (results) !->
        vm.todo = results

  vm.delete = !->
    Todo
      .delete-by-id vm.todo
      .$promise
      .then (response) !->
        # console.log response
        $state.go 'app.todos'

  vm.get-todo!

angular
  .module \app.todo-detail, []
  .controller 'TodoDetailController', todo-detail-controller
