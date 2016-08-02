angular
  .module('app')
  .controller('TodoController', ['$scope', '$state', 'Todo', 'LoopBackAuth', function($scope,
      $state, Todo, LoopBackAuth) {
    $scope.todos = [];
    function getTodos() {
      Todo
        .find({filter:
          {include: "owner"}
        })
        .$promise
        .then(function(results) {
          $scope.todos = results;
        });
    }
    getTodos();

    $scope.addTodo = function() {
      var newTodo = $scope.newTodo || {};
      newTodo.ownerId = LoopBackAuth.currentUserId;
      Todo
        .create($scope.newTodo)
        .$promise
        .then(function(todo) {
          $scope.newTodo = '';
          $scope.todoForm.content.$setPristine();
          $('.focus').focus();
          getTodos();
        });
    };

    $scope.removeTodo = function(item) {
      Todo
        .deleteById(item)
        .$promise
        .then(function() {
          getTodos();
        });
    };
  }]);
