'use strict'
angular.module('quoraApp')

.directive('comment', function($window){
	return {
		restrict: 'E',
		transclude: true,
        controller : function($scope){
            $scope.toggleLike = function(){
                $scope.comment.liked = !$scope.comment.liked;
                if($scope.comment.liked == true){
                    $scope.comment.upvotes++;
                }
                else{
                    $scope.comment.upvotes--;
                }
            }

            $scope.toggleReport = function(){
                $scope.comment.reported = !$scope.comment.reported;
            }
        },
		link: function(scope, element, attrs){
            
		},
		templateUrl : "templates/comment-template.html"
	}
});
