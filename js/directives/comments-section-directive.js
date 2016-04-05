'use strict'
angular.module('quoraApp')
.directive('commentsSection', function($window){
    return {
        restrict: 'E',
        transclude: false,
        controller: function($scope){
            $scope.showComments = false;
            $scope.moreCommentsShown = false;
            $scope.noComments = true;

            $scope.$watchCollection(
                function(){
                    //XXX: beware! does tight coupling occur between the comments section and a post?
                    return $scope.post.comments;
                },
                function(newComments){
                    if(newComments){
                        $scope.lessComments = newComments.slice(0,2);
                        $scope.moreComments = newComments.slice(2);
                        $scope.hasMoreComments = $scope.moreComments.length > 0;
                        $scope.noComments = false;
                    }

                    if(!newComments || newComments.length === 0){
                        $scope.noComments = true;
                    }
                }
            );

            $scope.toggleShowComments = function(){
                $scope.showComments = !$scope.showComments;
                $scope.cancelEdit();

            }

            $scope.showMoreComments = function(){
                $scope.moreCommentsShown = true;
            }

            //Editing a comment is a two-step process: the previous comment is deleted and the new comment is added.
            $scope.addComment = function(comment){
                if($scope.editing){
                    //Remove the edited from the post
                    $scope.deleteComment($scope.editedComment, false);
                    $scope.editedComment = null;
                    $scope.editing = false;
                }
                $scope.post.comments.push($scope.$parent.newComment($scope.post.id, comment));
            }

            //Enter edition mode and temporarily remove the comment from the front-end's post's comments.
            $scope.editComment = function(comment){
                $scope.editing = true;
                $scope.editedComment = comment;
                $scope.user_comment = comment.body;
                $scope.isAddCommentActive = true;
                $scope.removeComment(comment);
            }

            //Restore the removed comment and exit edition mode.
            $scope.cancelEdit = function(){
                $scope.revertComment();
                $scope.user_comment = "";
                $scope.isAddCommentActive = false;
                $scope.editing = false;
                $scope.editedComment = null;
                $scope.tempComments = null;
            }

            //Delete a comment from the server
            $scope.deleteComment = function(comment, requireConfirmation){
                //TODO: implement fancier confirmation.
                if(requireConfirmation && confirm("Are you sure you want to delete this comment?")){
                    //FIXME: rename deleteComment either here or in the main controller so that there are no confusions
                    $scope.removeComment(comment);
                    $scope.tempComments = null;
                    $scope.$parent.deleteComment($scope.post, comment.id);
                }
            }

            //Removes a comment from the UI and stores a temporary copy of the comments, allowing to revert changes.
            $scope.removeComment = function(comment){
                $scope.tempComments = $scope.post.comments;
                $scope.post.comments = $scope.post.comments.filter(function(el){return el.id !== comment.id});
            }

            $scope.revertComment = function(){
                if($scope.tempComments){
                    $scope.post.comments = $scope.tempComments;
                }
            }
        },
        templateUrl: 'templates/comments-section-template.html'
    }
});
