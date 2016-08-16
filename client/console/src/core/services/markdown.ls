'use strict'

Service = ->

  marked.set-options do
    math: (text) ->
      try
        katex.render-to-string text, do
          displayMode: true

      catch {message}
        message

    inlineMath: (text) ->
      try
        katex.render-to-string text, do
          displayMode: false

      catch {message}
        message

  Markdown = !->

  Markdown.prototype.render = (md) ->
    if not _.is-empty md
      marked md
    else
      ''

  new Markdown!

angular
  .module 'app.core'
  .factory 'Markdown', Service
