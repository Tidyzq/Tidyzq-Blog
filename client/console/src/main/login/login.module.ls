'use strict'

config = ($state-provider) !->
  $state-provider
    .state 'login', {
        url: '/login',
        views:
          'main':
            template-url: '/console/main/login/login.template.html'
            controller : 'LoginController as vm'
    }

angular
  .module 'app.login', []
  .config config
