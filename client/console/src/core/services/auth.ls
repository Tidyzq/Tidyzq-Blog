'use strict'

Service = (LoopBackAuth, User, $rootScope) ->
  Auth = !->
    @current-user = {}
    @is-loged-in = @is-loged-out = false

  Auth.prototype.get-user = ->
    self = @
    id = LoopBackAuth.current-user-id
    if id
      User
        .get-current {
          filter:
            include: 'roles'
        }
        .$promise
        .then (response) !->
          self.confirm-log-in response
        .catch (response) !->
          self.on-error response
    else
      @clear-log-in!

  Auth.prototype.confirm-log-in = (user-info) !->
    user-info.is-admin = _.includes user-info.roles, 'admin'
    @current-user = _.extend @current-user, user-info
    @is-loged-in = true
    @is-loged-out = false

  Auth.prototype.clear-log-in = !->
    LoopBackAuth.clear-user!
    LoopBackAuth.clear-storage!
    clear-object @current-user
    @is-loged-in = false
    @is-loged-out = true

  Auth.prototype.log-in = (user) ->
    self = @
    if _.is-empty @current-user
      User
        .login user
        .$promise
        .then (response) !->
          self.get-user!
        .catch (response) !->
          self.on-error response
    else
      Promise.reject 'already signed'

  Auth.prototype.log-out = ->
    self = @
    if not _.is-empty @current-user
      User
        .logout!
        .$promise
        .then (response) !->
          self.clear-log-in!
        .catch (response) !->
          self.on-error response
    else
      Promise.reject 'not signed'

  Auth.prototype.on-error = (err) !->
    @clear-log-in!
    throw err

  clear-object = (obj) ->
    for key in _.keys obj
      if obj.hasOwnProperty key
        delete obj[key]
    obj

  auth = $rootScope.Auth = new Auth!
  auth.get-user!
  auth

angular
  .module 'app.core'
  .factory 'Auth', Service
