'use strict'
angular.module('quoraApp')
.directive('trendingBox', function($window){
    return {
        restrict : 'E',
        scope : true,
        controller : function($scope){
            $scope.toggleTagFilter = function(tag){
                //XXX: WARNING: DO NOT LOSE THE REFERENCE TO ACTIVETAGS BY CREATING A NEW ARRAY. IT IS BEING WATCHED BY THE HOME CONTROLLER
                $scope.$broadcast('filterChange', tag);
                // //This code can be used to have more than one tag active at once.
                // var removed = false;
                // for(var i = $scope.activeTags.length - 1; i >= 0; i--){
                //     if($scope.activeTags[i] === tag){
                //         $scope.activeTags.splice(i, 1);
                //         removed = true;
                //         break;
                //     }
                // }
                // if(!removed){
                //     $scope.activeTags.push(tag);
                // }
                ////End code fragment
            }
        },
        link : function(scope, elems, attrs){
            //XXX: Resize the floating trending box on window resize and on DOM load.
            $(function(){$("#trendingBox").width($("#trendingBoxContainer").width());});
            $(window).on('resize', function(){
                $("#trendingBox").width($("#trendingBoxContainer").width());
            });
        },
        templateUrl:"templates/trending-box-template.html"
    }
});
