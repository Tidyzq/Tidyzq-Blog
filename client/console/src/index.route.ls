'use strict'

angular
  .module \blog
  .config [
    \$stateProvider
    \$urlRouterProvider
    \$locationProvider
    route
  ]

function route ($state-provider, $url-router-provider, $location-provider)

  $location-provider.html5-mode true

  $state-provider
    .state \app, do
      abstract: true
      views:
        main :
          template-url : '/core/layout/layout.template.html'
          controller : 'MainController as vm'
        \sidebar@app :
          template-url : '/core/sidebar/sidebar.template.html'
          controller : 'SidebarController as vm'
        \toolbar@app :
          template-url : '/core/toolbar/toolbar.template.html'
          controller : 'ToolbarController as vm'

  $url-router-provider .otherwise '/login'

  return
