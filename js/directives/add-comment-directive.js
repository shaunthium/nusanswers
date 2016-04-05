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

            /*
                XXX: this $watch hack is a solution to the lack of two-way binding seen in the text area
            */
            $scope.$watch(function(){
                return $scope.user_comment;
            },
            function(newVal, oldVal){
                if(newVal){
                    $scope.commentLongEnough = newVal.length >= $scope.COMMENTS_MIN_SIZE;
                    $scope.commentTooLong = newVal.length > $scope.COMMENTS_MAX_SIZE;
                    $scope.charactersMissing = $scope.COMMENTS_MIN_SIZE - newVal.length;
                    $scope.charactersRemaining = $scope.COMMENTS_MAX_SIZE - newVal.length;
                    $scope.extraCharacters = Math.abs($scope.charactersRemaining);
                }
                else{
                    $scope.commentLongEnough = false;
                    $scope.commentTooLong = false;
                    $scope.charactersMissing = $scope.COMMENTS_MIN_SIZE;
                    $scope.charactersRemaining = $scope.COMMENTS_MAX_SIZE;
                    $scope.extraCharacters = Math.abs($scope.charactersRemaining);
                }
            });

            $scope.toggleAddCommentVisible = function(){
                $scope.isAddCommentActive = !$scope.isAddCommentActive;
            }

            $scope.submitComment = function(){
                if(!$scope.commentLongEnough || $scope.commentTooLong){
                    alert("Comment not valid"); // TODO: Make this feedback cooler
                    return;
                }

                /*FIXME: $scope.currentUser is undefined. This is probably due to a scoping issue introduced by passing "post" as parent.*/
                $scope.parent.comments.push({author: $scope.currentUser, body:$scope.user_comment, upvotes:0});
                $scope.user_comment = "";
                $scope.isAddCommentActive = !$scope.isAddCommentActive;

                $scope.moreCommentsShown = true;
            }
        },
		templateUrl : "templates/add-comment-template.html"
	}
})
