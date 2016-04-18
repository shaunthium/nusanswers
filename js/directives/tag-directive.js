'use strict'
angular.module('quoraApp')
.directive('tag', function($window){
    return {
        restrict : 'E',
        transclude : true,
        scope : true,
        controller : function($scope){
        },
        link : function(scope, elems, attrs){
            scope.isFilter = 'isFilter' in attrs;
            scope.tag = 'value' in attrs ? attrs.value : scope.tag;
            scope.type = 'type' in attrs ? attrs.type : undefined;
            // console.log("tag type: ", scope.type);
            if(scope.isFilter){
                scope.activeFilter = false;
                scope.$on("filterChange", function(event, selectedTag){
                    if(selectedTag === scope.tag){
                        scope.activeFilter = !scope.activeFilter;
                    }
                    else{
                        scope.activeFilter = false;
                    }
                    if(!scope.activeFilter){
                        var index = scope.activeTags.indexOf(scope.tag);
                        if(index >= 0){
                            scope.activeTags.splice(index, 1);
                        }
                    }
                    else {
                        scope.activeTags.push(scope.tag);
                    }
                });
            }
        },
        templateUrl:"templates/tag-template.html"
    }
});
