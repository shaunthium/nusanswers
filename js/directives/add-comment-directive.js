'use strict'
angular.module('quoraApp')

.directive('addCommentBox', function($window){
	return {
		restrict: 'E',
		transclude: true,
        controller: function($scope){
            $scope.isAddCommentActive = false;
            $scope.COMMENTS_MIN_SIZE = 15;
            $scope.COMMENTS_MAX_SIZE = 30;

            $scope.toggleAddCommentVisible = function(){
                console.log("comment");
                $scope.isAddCommentActive = !$scope.isAddCommentActive;
            }

            $scope.submitComment = function(){
                if($scope.user_comment.length > $scope.COMMENTS_MAX_SIZE ||
                    $scope.user_comment.length < $scope.COMMENTS_MIN_SIZE){
                    alert("Comment not valid"); // Make this feedback cooler later
                    return;
                }

                $scope.post.comments.push({author:'Dummy', body:$scope.user_comment, upvotes:0});
                $scope.user_comment = "";
                $scope.isAddCommentActive = !$scope.isAddCommentActive;
            }
        },
		templateUrl : "templates/add-comment-template.html"
	}
})
