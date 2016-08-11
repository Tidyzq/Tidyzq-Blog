'use strict'

Service = (LoopBackAuth, User) ->
  Auth = !->
    @current-user = {}
    @get-user!

  Auth.prototype.get-user = ->
    self = @
    id = LoopBackAuth.current-user-id
    if id
      User
        .get-current!
        .$promise
        .then (response) !->
          self.current-user = _.extend self.current-user, response
        .catch (response) !->
          self.on-error!

  Auth.prototype.clear = !->
    LoopBackAuth.clear-user!
    LoopBackAuth.clear-storage!
    clear-object @current-user

  Auth.prototype.log-in = (user) ->
    self = @
    if _.is-empty @current-user
      User
        .login user
        .$promise
        .then (response) !->
          self.get-user!
        .catch (response) !->
          self.on-error!
    else
      Promise.reject 'already signed'

  Auth.prototype.log-out = ->
    self = @
    if not _.is-empty @current-user
      User
        .logout!
        .$promise
        .then (response) !->
          self.clear!
        .catch (response) !->
          self.on-error!
    else
      Promise.reject 'not signed'

  Auth.prototype.on-error = (err) !->
    @clear!
    throw err

  clear-object = (obj) ->
    for key in _.keys obj
      if obj.hasOwnProperty key
        delete obj[key]
    obj

  new Auth!

angular
  .module 'app.core'
  .factory 'Auth', Service
