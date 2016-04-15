/*
    Post definition: a "Post" element engulfs two types of elements: "Questions" and "Answers".
    The Post will be instantiated with a "type", which can either be Question or Answer.

    **FIELDS***
                            Question:       Answer:
    id                  |       X        |     X      |
    title               |       X        |            |
    category            |       X        |            |
    author              |       X        |     X      |
    views               |       X        |            |
    desc (description)  |       X        |     X      |
    upvotes             |       X        |     X      |
    comments            |       X        |     X      |
    answers             |       X        |            |
*/

'use strict'
angular.module('quoraApp')

.directive('post', function($window){
	return {
		restrict: 'E',
		transclude: true,
        controller: function($http, $scope, $state, $rootScope, $timeout, questionService){
            $scope.editMode = false;
            $scope.includeTags = false;
            $scope.includeTitle = false;
            $scope.linkToQuestionPage = false;
            $scope.includeAuthorFlavor = false;
            $scope.showFooter = false;
            $scope.editMode = false;

            $scope.toggleFooter = function(){

                if(!$scope.currentUser){
                  $scope.showLogin();
                  return;
                }

                $scope.showFooter = !$scope.showFooter;
            }

            $scope.toggleEditMode = function(){

                $('#wysiwyg-editor-questionbody').trumbowyg({
                    fullscreenable: false,
                    btns:['bold', 'italic']
                });

                $scope.editMode = !$scope.editMode;
            }


            $scope.incrementUpvotes = function(post, inc) {

              if(!$scope.currentUser){
                $scope.showLogin();
                return;
              }

              // User should not be able to downvote/upvote multiple times
              // change loggedinUserId to $scope.facebookuserid or something..
              if(inc == 1){
                post.upvotes++;
                questionService.submitUpvotePost(post.id, $scope.currentUser.id, $scope.type);
              } else {
                post.upvotes--;
                questionService.submitDownvotePost(post.id, $scope.currentUser.id, $scope.type);
              }

            };

            $scope.removeTag = function(tag){
                console.log("Remove tag");
                questionService.removeTag($scope.post.id, tag).then(function(res){
                    $scope.post.tags = $scope.post.tags.filter(function(el){return el !== tag;});
                },
                function(err){
                    console.log("Error while deleting tag from the question!");
                });
            }

            $scope.addTag = function(tag){
                questionService.addTag($scope.post.id, tag).then(function(res){
                    $scope.post.tags.push(tag);
                },
                function(err){
                    console.log("Error while adding tag to the question!");
                });
            }
        },
        link : function(scope, element, attrs){
            scope.type = attrs.type;
            scope.showFooter = "showFooter" in attrs;

            //This watch is for getting the post in question-answers view.
            scope.$watchCollection(function(){
                return scope.post;
            },
            function(post){
                if(post){
                    scope.answered = post.answered;
                    scope.isEditable = scope.type === 'question' && scope.currentUser && scope.currentUser.id === scope.post.author.userid;
                }
            });

            //This watch will make the post editable when the user logs-in in the question-answers view
            scope.$watchCollection(function(){
                return scope.currentUser;
            },
            function(currentUser){
                if(currentUser && scope.post){
                    scope.isEditable = scope.type === 'question' && scope.currentUser && scope.currentUser.id === scope.post.author.userid;
                }
            })

            switch(attrs.type){
                case "feed-item":
                    scope.includeTags = true;
                    scope.includeTitle = true;
                    scope.linkToQuestionPage = true;
                    scope.includeAuthorFlavor = true;
                    break;
                case "question":
                    scope.includeTags = true;
                    scope.includeTitle = true;
                    scope.includeAuthorFlavor = true;
                    break;
                case "answer":
                    scope.includeAuthorFlavor = true;
                    break;
            }
        },
		templateUrl : "templates/post-template.html"
	}
})
