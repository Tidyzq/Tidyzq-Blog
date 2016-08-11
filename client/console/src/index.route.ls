'use strict'
angular
  .module \blog
  .config ['$stateProvider', '$urlRouterProvider' '$locationProvider', ($state-provider, $url-router-provider, $location-provider) !->

    $location-provider.html5-mode true

    $state-provider
      .state 'app' {
        abstract: true
        views:
          'main@':
            template-url: '/core/layout/layout.template.html'
          'sidebar@app':
            template-url: '/core/sidebar/sidebar.template.html'
            controller: 'SidebarController as vm'
      }
      .state 'app.main' {
        url: '/'
      }
      # .state 'app.todos' {
        # url: '/'
        # views:
        #   'content@app':
        #     template-url: '/views/todo.html'
        #     controller: 'TodoController as vm'
        # resolve:
        #   dataSource: (Todo) ->
        #     ->
        #       Todo
        #         .find filter:
        #           include: 'owner'
        #         .$promise
      # }
      # .state 'app.todo-detail' {
      #   url: '/:id'
      #   views:
      #     'content@app':
      #       template-url: '/views/todo-detail.html'
      #       controller: 'TodoDetailController as vm'
      #   resolve:
      #     dataSource: (Todo, $state-params) ->
      #       ->
      #         Todo
      #           .findById {
      #             id: $state-params.id
      #             filter:
      #               include: 'owner'
      #           }
      #           .$promise
      # }

    $url-router-provider .otherwise '/login'
  ]
