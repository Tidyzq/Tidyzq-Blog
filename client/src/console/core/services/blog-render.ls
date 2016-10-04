'use strict'

Service.$inject = [\Render,\$rootScope,\Notification ]
function Service  ( Render, $rootScope, Notification )
  BlogRender = !->

  BlogRender.prototype.render-all = ->
    Notification.send 'warning', 'Rendering ...'
    Render
      .render-all!
      .$promise

  new BlogRender!

angular
  .module 'app.core'
  .factory 'BlogRender', Service
