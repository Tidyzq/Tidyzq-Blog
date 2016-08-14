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

  $url-router-provider .otherwise '/login'

angular
  .module \blog
  .config route
