'use strict'

Service.$inject = [\Setting,\$rootScope ]
function Service  ( Setting, $rootScope )
  BlogSetting = !->
    @current-setting = {}
    @is-loaded = false
    @get-settings!

  BlogSetting.prototype.get-settings = ->
    self = @
    self.is-loaded = false
    Setting
      .find!
      .$promise
      .then (response) !->
        parse-setting self.current-setting, response
        self.is-loaded = true
      .catch self.on-error

  BlogSetting.prototype.on-error = (err) !->
    console.error err
    throw err

  parse-setting = (obj, array) ->
    for item in array
      obj[item.key] = item.value
    obj

  # clear-object = (obj) ->
  #   for key in _.keys obj
  #     if obj.hasOwnProperty key
  #       delete obj[key]
  #   obj

  new BlogSetting!

angular
  .module 'app.core'
  .factory 'BlogSetting', Service
