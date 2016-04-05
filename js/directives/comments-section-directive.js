'use strict'
angular.module('quoraApp')

.directive('commentsSection', function($window){
    return {
        restrict: 'E',
        transclude: false,
        scope: {
            parent : '='
        },
        controller: function($scope){
            $scope.showComments = false;
            $scope.moreCommentsShown = false;
            $scope.noComments = true;
            if($scope.parent){
                if($scope.parent.comments){
                    $scope.$watch(function(){
                        return $scope.parent.comments.length;
                    },
                    function(newVal, oldVal){
                        if(newVal > 0){
                            $scope.lessComments = $scope.parent.comments.slice(0,2);
                            $scope.moreComments = $scope.parent.comments.slice(2);
                            $scope.hasMoreComments = $scope.moreComments.length > 0;
                            $scope.noComments = false;
                        }
                        else{
                            $scope.noComments = true;
                        }
                    });
                }
            }

            $scope.toggleShowComments = function(){
                $scope.showComments = !$scope.showComments;
            }

            $scope.showMoreComments = function(){
                $scope.moreCommentsShown = true;
            }
        },
        templateUrl: 'templates/comments-section-template.html'
    }
});
