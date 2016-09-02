'use strict'

function Service

  Toolbar = !->
    @setting = {}

  clear-object = (obj) ->
    for key in _.keys obj
      if obj.hasOwnProperty key
        delete obj[key]
    obj

  Toolbar.prototype.config = (config) ->
    if config.buttons && not _.is-array config.buttons
      config.buttons = [ config.buttons ]

    config = _.pick config, ['buttons', 'input', 'parent', 'child']

    clear-object @setting
    @setting = _.extend @setting, config

  Toolbar.prototype.input-changed = (input) !->
    return

  Toolbar.prototype.on-click = (btn-index) !->
    return

  Toolbar.prototype.enable-btn = (btn-index, enable) !->
    if @setting.buttons && @setting.buttons[btn-index]
      @setting.buttons[btn-index].disabled = !enable

  new Toolbar!

angular
  .module 'app.core'
  .factory 'Toolbar', Service
