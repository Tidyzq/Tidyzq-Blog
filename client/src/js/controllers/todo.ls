todo-controller = ($scope, $state, Todo, LoopBackAuth) !->

  $scope.todos = []

  get-todos = !->
    Todo
      .find filter:
          include: 'owner'
      .$promise
      .then (results) !->
        $scope.todos = results

  $scope.addTodo = !->
    Todo
      .create $scope.new-todo
      .$promise
      .then (todo) !->
        $scope.new-todo = ''
        $scope.todo-from.content.$set-pristine!
        $('.focus').focus!
        get-todos!

  $scope.remove-todo = (item) !->
    Todo
      .delete-by-id item
      .$promise
      .then !->
        get-todos!

  get-todos!

angular
  .module \app
  .controller 'TodoController', ['$scope', '$state', 'Todo', 'LoopBackAuth', todo-controller]
