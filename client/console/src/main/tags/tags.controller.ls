'use strict'

Tags-controller = (tags, $state, $scope, $root-scope, Tag) !->

  vm = @

  vm.tags = tags

  $scope.$on 'reload', !->
    vm.tags = Tag
                .find do
                  filter:
                    include:
                      relation: 'documents'
                      scope:
                        fields:
                          id: true

  vm.detail = (tag) !->
    $state.go 'app.tags.detail', tag

angular
  .module \app.tags
  .controller 'TagsController', Tags-controller
