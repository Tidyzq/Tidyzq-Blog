'use strict'

route = ($state-provider, $url-router-provider, $location-provider, Sidebar-menu-provider) !->

  $location-provider.html5-mode true

  $state-provider
    .state 'app' {
      abstract: true
      views:
        'main@':
          template-url: '/core/layout/layout.template.html'
          controller: 'MainController as vm'
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

angular
  .module \blog
  .config route
