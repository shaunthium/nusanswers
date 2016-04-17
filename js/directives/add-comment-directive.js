'use strict'
angular.module('quoraApp')

.directive('addCommentBox', function($window){
	return {
		restrict: 'E',
        controller: function($scope){
            $scope.isAddCommentActive = false;
            $scope.COMMENTS_MIN_SIZE = 5;
            $scope.COMMENTS_MAX_SIZE = 100;

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

                if(!$scope.currentUser){
                    $scope.showLogin();
                    return;
                }


                $scope.isAddCommentActive = !$scope.isAddCommentActive;

                //If adding a comment was cancelled.
                if(!$scope.isAddCommentActive){
                    $scope.rejectComment();
                }
            }

            $scope.acceptComment = function(){
                if(!$scope.commentLongEnough){
                    Materialize.toast("The comment does not meet minimum length.", 2000, 'information-toast');
                    return;
                }
                if($scope.commentTooLong){
                    Materialize.toast("The comment exceeds maximum length.", 2000, 'information-toast');
                    return;
                }

                $scope.addComment($scope.user_comment);
                $scope.moreCommentsShown = true;
                $scope.user_comment = "";
                $scope.isAddCommentActive = !$scope.isAddCommentActive;
            }

            $scope.rejectComment = function(){
                $scope.cancelEdit();
                $scope.isAddCommentActive = false;
            }
        },
		templateUrl : "templates/add-comment-template.html"
	}
})
