'use strict'
angular.module('quoraApp')

.directive('comment', function($window){
	return {
		restrict: 'E',
		transclude: true,
        controller : function($scope){
            $scope.toggleLikeComment = function(comment){
                comment.liked = !comment.liked;
            }

            $scope.toggleReportComment = function(comment){
                comment.reported = !comment.reported;
            }
        },
		link: function(scope, element, attrs){
			scope.upvotes = attrs.upvotes;
			scope.user = attrs.user;
		},
		templateUrl : "templates/comment-template.html"
	}
});
