'use strict'
angular.module('quoraApp')
.directive('commentsSection', function($window){
    return {
        restrict: 'E',
        transclude: false,
        controller: ['$scope', 'questionService', function($scope, questionService){
            $scope.showComments = false;
            $scope.moreCommentsShown = false;
            $scope.noComments = true;

            // A bit ugly
            $scope.$watchCollection(
              function(){
                  return $scope.post;
              },
              function(post){
                if(post){
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
                };
              }
            );

            $scope.toggleShowComments = function(){

                if(!$scope.showComments){

                    $scope.showComments = true;



                    if($scope.type === 'answer'){
                        questionService.getCommentsFromAnswer($scope.post.id, $scope.currentUser.id)
                        .then(
                            function(res){

                                console.log("res from answer comment", res);

                                if(res.data){
                                    $scope.post.comments = res.data;
                                } else {
                                    console.log("Answer did not contain any comments");
                                }
                            },
                            function(err){
                                console.log("Error in getting comments to answer ", err);
                            }
                        )
                    }
                    else{
                        questionService.getCommentsFromQuestion($scope.post.id)
                        .then(
                            function(res){
                                if(res.data){
                                    $scope.post.comments = res.data;
                                }
                            },
                            function(err){
                                 console.log("Error in getting comments from question ", err);
                            }
                        );
                    }
                }
                else{
                    $scope.cancelEdit();
                    $scope.showComments = false;
                }
            }

            $scope.showMoreComments = function(){
                $scope.moreCommentsShown = true;
            }

            //Editing a comment is a two-step process: the previous comment is deleted and the new comment is added.
            $scope.addComment = function(comment){
                if($scope.type === 'answer'){
                    console.log("ans ", $scope.post)
                    questionService.addCommentToAnswer(comment, $scope.currentUser.id, $scope.post.id)
                        .then(function(res){
                            console.log("Add comment to answer", res);
                            if(res.data){
                                if($scope.editing){
                                    //Remove the edited from the post

                                    $scope.deleteComment($scope.editedComment, false);
                                    $scope.editedComment = null;
                                    $scope.editing = false;
                                }
                                //TODO: fix server response indexing. Get rid of unneccessary array.
                                // add comment to scope
                                $scope.post.comments.push(res.data[0]);
                                // console.log("Success post comment", res);
                            }
                        }, function(err){
                            // console.log("Error in posting comment", err);
                        });
                }
                else{
                    questionService.submitNewComment(comment, $scope.currentUser.id, $scope.post.id)
                    .then(function(res){
                        if(res.data){
                            console.log("res from server", res);
                            if($scope.editing){
                                //Remove the edited from the post
                                $scope.deleteComment($scope.editedComment, false);
                                $scope.editedComment = null;
                                $scope.editing = false;
                            }
                            //TODO: fix server response indexing. Get rid of unneccessary array.
                            // add comment to scope
                            $scope.post.comments.push(res.data[0]);
                            // console.log("Success post comment", res);
                        }
                    }, function(err){
                        console.log("Error in posting comment to answer ", err);
                    });
                }
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

                console.log("TRYING TO DELETE COMMENT ", $scope.type);

                if(!requireConfirmation || confirm("Are you sure you want to delete this comment?")){

                    console.log("OK ", $scope.type);

                    if($scope.type === 'answer'){
                        questionService.deleteCommentFromAnswer(comment.id, $scope.currentUser.id)
                        .then(
                            function(res){
                                if(res.data){
                                    $scope.removeComment(comment);
                                    $scope.tempComments = null;
                                }
                            },
                            function(err){
                                console.log("Error in deleting comment from answer", err);
                            }
                        );
                    }
                    else{
                        questionService.submitDeleteComment(comment.id, $scope.currentUser.id)
                        .then(
                            function(res){
                                if(res.data){
                                    console.log("data ", res.data);
                                    $scope.removeComment(comment);
                                    $scope.tempComments = null;
                                }
                            },
                            function(err){
                                console.log("ERror in deleting comment from question", err);
                            }
                        );
                    }
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
        }],
        templateUrl: 'templates/comments-section-template.html'
    }
});
