'use strict'

bootstrap-datatimepicker = ->
  restrict: 'A'
  require: 'ngModel'
  scope:
    model: '=ngModel'
  link: (scope, element, attr, ng-model) !->


    $ element .datetimepicker do
      side-by-side: true
      # default-date:
      widget-parent: $ 'body'
      widget-positioning:
        vertical: 'bottom'

    scope.$watch 'model', !->
      # console.log 'watch'
      model-date = moment ng-model.$model-value
      # console.log model-date
      picker = $ element .data 'DateTimePicker'
      picker-date = picker .date!
      if not picker-date
        # console.log 'set'
        picker .date model-date

    $ element .on 'dp.show', !->
      offset = $ element .offset!

      elem-height = $ element .outer-height!
      elem-width = $ element .outer-width!
      picker-height = $ '.bootstrap-datetimepicker-widget' .height!
      picker-width = $ '.bootstrap-datetimepicker-widget' .width!
      window-height = $ 'body' .height!
      window-width = $ 'body' .width!

      console.log elem-height, elem-width
      $ '.bootstrap-datetimepicker-widget' .css do
        top: offset.top + elem-height + 5
        left: Math.min offset.left, window-width - picker-width - 15
        right: 'auto'
        bottom: 'auto'

    $ element .on 'dp.change', (event) !->
      # console.log 'change'
      val = event.date
      ng-model.$set-view-value val.to-ISO-string!

angular
  .module 'app.core'
  .directive 'bootstrapDatatimepicker', bootstrap-datatimepicker
