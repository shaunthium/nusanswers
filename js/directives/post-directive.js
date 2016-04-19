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

.directive('post', function($http, $window){
	return {
		restrict: 'E',
		transclude: true,
        controller: ['$http', '$scope', '$state', '$rootScope', '$timeout', 'questionService', 'questionTitleFilter', '$sce',
                    function($http, $scope, $state, $rootScope, $timeout, questionService, questionTitleFilter, $sce){
            var MAXIMUM_TAGS = 5;
            var MAXIMUM_TAG_LENGTH = 20;
            var canUpvote = true;
            $scope.editMode = false;
            $scope.includeTags = false;
            $scope.includeTitle = false;
            $scope.linkToQuestionPage = false;
            $scope.includeAuthorFlavor = false;
            $scope.showFooter = false;
            $scope.editMode = false;
            $scope.includeProfileImage = false;
            $scope.includeTagInputField = false;
            $scope.includeVotes = false;
            $scope.includeBody = false;
            $scope.includeEditTitle = false;
            $scope.collapseAuthor = false;


            //This watch is for getting the post in question-answers view.
            $scope.$watchCollection(function(){
                return $scope.post;
            },
            function(post){
                if(post){
                    $scope.answered = post.answered;
                    if($scope.currentUser){
                        $scope.isEditable = $scope.currentUser.isAdmin || ($scope.type !== 'feed-item' && $scope.currentUser.id === $scope.post.author.userid);
                    }
                    else{
                        $scope.isEditable = false;
                    }
                    $scope.temp = {title : post.title};

                    // TODO: Can't get this to work, we need to render the html tags somehow
                    //post.content = $sce.trustAsHtml(post.content);

                    $http({
                      url: 'http://graph.facebook.com/v2.5/' + $scope.post.author.userid + '/picture?redirect=false&width=9999',
                      method: 'GET',
                      data: {
                        width: '1000'
                      }
                    }).success(function(data) {
                      $scope.profileImg = data.data.url;
                    }).error(function(data) {
                      $scope.profileImg = 'http://dummyimage.com/300/09.png/fff';
                    });
                }
            });

            //This watch will make the post editable when the user logs-in in the question-answers view
            $scope.$watchCollection(function(){
                return $scope.currentUser;
            },
            function(currentUser){
                if(currentUser && $scope.post){
                    $scope.isEditable = currentUser.isAdmin || ($scope.type !== 'feed-item' && currentUser.id === $scope.post.author.userid);
                }
            });

            $scope.confirmDelete = function(){
                $('#delete-confirm-box-'+$scope.type+"-"+$scope.post.id).openModal();
            }

            $scope.toggleFooter = function(){

                if(!$scope.currentUser){
                  $scope.showLogin();
                  return;
                }

                $scope.showFooter = !$scope.showFooter;
            }

             $('.tooltipped').tooltip({delay: 50});

            $scope.toggleEditMode = function(){
                $scope.userInput = "";
                $scope.editMode = !$scope.editMode;
                if($scope.editMode){
                    $scope.temp.title = $scope.post.title;
                    $('#wysiwyg-editor-' + $scope.type + '-body-' + $scope.post.id).trumbowyg({
                        fullscreenable: false,
                        btns:['bold', 'italic']
                    });

                    $('#wysiwyg-editor-' + $scope.type + '-body-' + $scope.post.id).trumbowyg('html', $scope.post.content);
                }
                else{
                    Materialize.toast('Changes not saved.', 2000, 'information-toast')
                }
            }

            $scope.saveChanges = function(){

                if($scope.type !== 'answer' && (!$scope.temp.title || $scope.temp.title.length < QUESTION_TITLE_MIN_LENGTH)){
                    Materialize.toast('Error: question title is too short!', 2000, 'error-toast');
                    return;
                }
                if($scope.type !== 'answer' && ($scope.temp.title !== questionTitleFilter($scope.temp.title))){
                    Materialize.toast('Error: question title contains invalid characters!', 2000, 'error-toast');
                    return;
                }
                if($scope.type !== 'answer' && ($scope.temp.title.charAt($scope.temp.title.length - 1) != "?")){
                    Materialize.toast('Error: a question should end with a question mark!', 2000, 'error-toast');
                    return;
                }

                $scope.temp.content = $('#wysiwyg-editor-' + $scope.type + '-body-' + $scope.post.id).trumbowyg('html');
                //XXX: arbitrarily defined maximum number of line breaks.
                if($scope.temp.content.split("<p>").length > 10){
                    Materialize.toast("Error: this question has too many lines...", 2000, 'error-toast');
                    return;
                }
                //XXX: arbitrarily defined maximum number of characters.
                if($scope.temp.content.length > 5000){
                    Materialize.toast("Error: maximum length exceeded by " + ($scope.temp.content.length - 5000) + " characters.", 2000, 'error-toast');
                    return;
                }



                if($scope.type === 'answer'){
                    questionService.editAnswer($scope.post.id, $scope.temp.content, $scope.currentUser.id)
                    .then(
                        function(res){
                            console.log("Edited answer!", res);
                            if(res.data){
                                $scope.post.content = $scope.temp.content;
                                Materialize.toast('Changes saved successfully!', 2000, 'success-toast');
                                $scope.editMode = !$scope.editMode;
                            }
                            else{
                                Materialize.toast('Could not save changes!', 2000, 'error-toast');
                                // console.log("Error while editing question!");
                            }
                        },
                        function(err){
                            Materialize.toast('Could not save changes!', 2000, 'error-toast');
                            // console.log("Error while editing question!");
                        }
                    );
                }
                else{
                    questionService.editQuestion($scope.post.id, $scope.temp.title, $scope.temp.content, $scope.currentUser.id)
                    .then(
                        function(res){

                            console.log("res from EDIT", res);

                            if(res.data){
                                $scope.post.title = $scope.temp.title;
                                $scope.post.content = $scope.temp.content;
                                Materialize.toast('Changes saved successfully!', 2000, 'success-toast');
                                $scope.editMode = !$scope.editMode;
                            }
                            else{
                                // console.log("Error while editing question!");
                            }
                        },
                        function(err){
                            // console.log("Error while editing question!");

                            console.log("err from EDIT", err);
                        }
                    );
                }
            }



            $scope.delete = function(){
                if($scope.type === 'answer'){
                    questionService.deleteAnswer($scope.post.id, $scope.currentUser.id)
                    .then(
                        function(res){
                            if(res.data){
                                Materialize.toast('Post deleted!', 2000, 'success-toast');
                                $state.reload(); //FIXME: maybe remove the answer from the post.answers array instead of reloading everything
                            }
                            else{
                                Materialize.toast('Server error!', 2000, 'error-toast');
                            }
                        },
                        function(err){
                            Materialize.toast('Server error!', 2000, 'error-toast');
                        }
                    );
                }
                else{
                    questionService.deleteQuestion($scope.post.id, $scope.currentUser.id)
                    .then(
                        function(res){
                            console.log("success in deleting question", res);
                            if(res.data){
                                Materialize.toast('Post deleted!', 2000, 'success-toast');
                                $scope.goToHome();
                            }
                            else{
                                Materialize.toast('Server error!', 2000, 'error-toast');
                            }
                        },
                        function(err){
                            console.log("Error in deleting question", err);
                            Materialize.toast('Server error!', 2000, 'error-toast');
                        }
                    );
                }
            }


            $scope.incrementUpvotes = function(inc){

              if(!$scope.currentUser){
                $scope.showLogin();
                return;
              }

              if(!canUpvote){
                // console.log("cannot upvote yet")
                return;
              }

              canUpvote = false;
              $timeout(function(){
                canUpvote = true;
              }, 500);

              // If upvoted
              if(inc == 1){
                  if($scope.post.upvoted){ // If post was already upvoted
                      questionService.submitCancelUpvotePost($scope.post.id, $scope.currentUser.id, $scope.type)
                      .then(
                          function(res){
                            if(res.data){
                              $scope.post.upvotes--;
                              $scope.post.upvoted = false;
                            }
                            else{
                                Materialize.toast('Server error!', 2000, 'error-toast');
                            }
                          },
                          function(err){
                              Materialize.toast('Server error!', 2000, 'error-toast');
                          }
                      );
                  }
                  else { // If post was downvoted, cancel and perform upvote
                      if($scope.post.downvoted){
                          questionService.submitCancelDownvotePost($scope.post.id, $scope.currentUser.id, $scope.type)
                          .then(
                              function(res){
                                if(res.data){
                                  //$scope.post.upvotes++;
                                  $scope.post.downvoted = false;
                                }
                                else{
                                    Materialize.toast('Server error!', 2000, 'error-toast');
                                }
                              },
                              function(err){
                                // console.log("Error in cancelling downvote" , err);
                              }
                          ).then(function(){
                            questionService.submitUpvotePost($scope.post.id, $scope.currentUser.id, $scope.type)
                            .then(
                                function(res){
                                    if(res.data){
                                        $scope.post.upvotes+=2;
                                        $scope.post.upvoted = true;
                                    }
                                    else{
                                        Materialize.toast('Server error!', 2000, 'error-toast');
                                    }
                                },
                                function(err){
                                  // console.log("Error in submitting upvote" , err);
                                }
                            );
                          });
                      } else { // Was not downvoted
                        questionService.submitUpvotePost($scope.post.id, $scope.currentUser.id, $scope.type)
                        .then(
                            function(res){
                                if(res.data){
                                    $scope.post.upvotes++;
                                    $scope.post.upvoted = true;
                                }
                                else {
                                    Materialize.toast('Server error!', 2000, 'error-toast');
                                }
                            },
                            function(err){
                                Materialize.toast('Server error!', 2000, 'error-toast');
                            }
                        );
                      }
                  }
              }
              else{

                  if($scope.post.downvoted){ // If post was downvoted, cancel downvote
                      questionService.submitCancelDownvotePost($scope.post.id, $scope.currentUser.id, $scope.type)
                      .then(
                          function(res){
                            if(res.data){
                              $scope.post.upvotes++;
                              $scope.post.downvoted = false;
                            }
                            else{
                                Materialize.toast('Server error!', 2000, 'error-toast');
                            }
                          },
                          function(err){
                              Materialize.toast('Server error!', 2000, 'error-toast');
                          }
                      );
                  }
                  else{ // Else if post was upvoted, cancel and then downvote
                      if($scope.post.upvoted){
                          questionService.submitCancelUpvotePost($scope.post.id, $scope.currentUser.id, $scope.type)
                          .then(
                              function(res){
                                if(res.data){
                                  //$scope.post.upvotes--;
                                  $scope.post.upvoted = false;
                                }
                                else{
                                    Materialize.toast('Server error!', 2000, 'error-toast');
                                }
                              },
                              function(err){
                                  Materialize.toast('Server error!', 2000, 'error-toast');
                              }
                          ).then(function(){
                            questionService.submitDownvotePost($scope.post.id, $scope.currentUser.id, $scope.type)
                            .then(
                                function(res){
                                    if(res.data){
                                        $scope.post.upvotes-=2;
                                        $scope.post.downvoted = true;
                                    }
                                    else{
                                        Materialize.toast('Server error!', 2000, 'error-toast');
                                    }
                                },
                                function(err){
                                    Materialize.toast('Server error!', 2000, 'error-toast');
                                }
                            );
                          })
                      } else { // Just downvote
                        questionService.submitDownvotePost($scope.post.id, $scope.currentUser.id, $scope.type)
                        .then(
                            function(res){
                                if(res.data){
                                    $scope.post.upvotes--;
                                    $scope.post.downvoted = true;
                                }
                                else{
                                    Materialize.toast('Server error!', 2000, 'error-toast');
                                }
                            },
                            function(err){
                                Materialize.toast('Server error!', 2000, 'error-toast');
                            }
                        );
                      }
                  }
              }
            }

            $scope.removeTag = function(tag){
                questionService.removeTag($scope.post.id, JSON.stringify([tag]))
                .then(
                    function(res){
                        if(res.data){
                            $scope.post.tags = $scope.post.tags.filter(function(el){return el !== tag;});
                        }
                        else{
                            Materialize.toast('Could not remove tag from question!', 2000, 'error-toast');
                        }
                    },
                    function(err){
                        Materialize.toast('Could not remove tag from question!', 2000, 'error-toast');
                    }
                );
            }

            $scope.addTag = function(tag){
                if($scope.post.tags.length > MAXIMUM_TAGS){
                    Materialize.toast("Sorry! The maximum number of tags for a post is " + MAXIMUM_TAGS + ".", 2000, 'error-toast');
                    return;
                }
                if(tag.length > MAXIMUM_TAG_LENGTH){
                    Materialize.toast("Sorry! The maximum tag length is " + MAXIMUM_TAG_LENGTH + " characters.", 2000, 'error-toast');
                    return;
                }

                questionService.addTag($scope.post.id, JSON.stringify([tag]))
                .then(
                    function(res){
                        if(res.data){
                            $scope.post.tags.push(tag);
                        }
                        else{
                            Materialize.toast('Could not add tag to question!', 2000, 'error-toast');
                        }
                    },
                    function(err){
                        Materialize.toast('Could not add tag to question!', 2000, 'error-toast');
                    }
                );
            }
        }],
        link : function(scope, element, attrs){
            scope.type = attrs.type;
            scope.showFooter = "showFooter" in attrs;

            switch(attrs.type){
                case "feed-item":
                    scope.includeTags = true;
                    scope.includeTitle = true;
                    scope.linkToQuestionPage = true;
                    scope.includeAuthorFlavor = true;
                    scope.includeProfileImage = true;
                    scope.includeVotes = true;
                    scope.includeBody = true;
                    break;
                case "question":
                    scope.includeTags = true;
                    scope.includeTitle = true;
                    scope.includeAuthorFlavor = true;
                    scope.includeProfileImage = true;
                    scope.includeTagInputField = true;
                    scope.includeVotes = true;
                    scope.includeBody = true;
                    scope.includeTagInputField = true;
                    scope.includeEditTitle = true;
                    break;
                case "answer":
                    scope.includeAuthorFlavor = true;
                    scope.includeProfileImage = true;
                    scope.includeVotes = true;
                    scope.includeBody = true;
                    break;
            }

            //If admin view was requested, override previous specifications
            switch(attrs.view){
                case "admin":
                    scope.includeTags = false;
                    scope.includeTitle = true;
                    scope.linkToQuestionPage = true;
                    scope.includeAuthorFlavor = false;
                    scope.showFooter = false;
                    scope.includeProfileImage = false;
                    scope.includeTagInputField = true;
                    scope.includeVotes = false;
                    scope.includeBody = false;
                    scope.includeEditTitle = true;
                    scope.collapseAuthor = true;
                    break;
            }
        },
		templateUrl : "templates/post-template.html"
	}
})
