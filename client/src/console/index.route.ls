'use strict'

angular
  .module \blog
  .config route

route.$inject = [\$stateProvider,\$urlRouterProvider,\$locationProvider ]
function route  ( $state-provider, $url-router-provider, $location-provider )

  $location-provider.html5-mode true

  $state-provider
    .state \app, do
      url: '/console'
      abstract: true
      views:
        main :
          template-url : 'console/core/layout/layout.template.html'
          controller : 'MainController as vm'
        \sidebar@app :
          template-url : 'console/core/sidebar/sidebar.template.html'
          controller : 'SidebarController as vm'
        \toolbar@app :
          template-url : 'console/core/toolbar/toolbar.template.html'
          controller : 'ToolbarController as vm'

  $url-router-provider .otherwise '/console/login'

  return
