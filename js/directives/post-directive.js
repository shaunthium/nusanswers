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
        controller: function($http, $scope, $state, $rootScope, $timeout, questionService, $sce){
            var MAXIMUM_TAGS = 5;
            var MAXIMUM_TAG_LENGTH = 20;
            $scope.editMode = false;
            $scope.includeTags = false;
            $scope.includeTitle = false;
            $scope.linkToQuestionPage = false;
            $scope.includeAuthorFlavor = false;
            $scope.showFooter = false;
            $scope.editMode = false;

            //This watch is for getting the post in question-answers view.
            $scope.$watchCollection(function(){
                return $scope.post;
            },
            function(post){
                if(post){
                    $scope.answered = post.answered;
                    $scope.isEditable = $scope.type === 'question' && $scope.currentUser && $scope.currentUser.id === $scope.post.author.userid;
                    $scope.temp = {title : post.title};

                    // TODO: Can't get this to work, we need to render the html tags somehow
                    //post.content = $sce.trustAsHtml(post.content);

                    // $http({
                    //   url: 'http://graph.facebook.com/v2.5/' + $scope.post.author.userid + '/picture?redirect=false&width=9999',
                    //   method: 'GET',
                    //   data: {
                    //     width: '1000'
                    //   }
                    // }).success(function(data) {
                    //   $scope.profileImg = data.data.url;
                    // }).error(function(data) {
                    //   $scope.profileImg = 'http://dummyimage.com/300/09.png/fff';
                    // });
                }
            });

            //This watch will make the post editable when the user logs-in in the question-answers view
            $scope.$watchCollection(function(){
                return $scope.currentUser;
            },
            function(currentUser){
                if(currentUser && $scope.post){
                    $scope.isEditable = $scope.type === 'question' && $scope.currentUser && $scope.currentUser.id === $scope.post.author.userid;
                }
            });



            $scope.toggleFooter = function(){

                if(!$scope.currentUser){
                  $scope.showLogin();
                  return;
                }

                $scope.showFooter = !$scope.showFooter;
            }

             $('.tooltipped').tooltip({delay: 50});

            $scope.toggleEditMode = function(){
                $scope.editMode = !$scope.editMode;
                if($scope.editMode){
                    $scope.temp.title = $scope.post.title;
                    $('#wysiwyg-editor-questionbody').trumbowyg({
                        fullscreenable: false,
                        btns:['bold', 'italic']
                    });
                }
                else{
                    Materialize.toast('Changes not saved.', 2000, 'information-toast')
                }
            }

            $scope.saveChanges = function(){

              if($scope.temp.title.length < QUESTION_TITLE_MIN_LENGTH){
                 Materialize.toast('Please write a proper question', 2000, 'err-toast');
                 return;
              }

              $scope.temp.content = $('#wysiwyg-editor-questionbody').trumbowyg('html');
              questionService.editQuestion($scope.post.id, $scope.temp.title, $scope.temp.content)
              .then(
                  function(res){
                      if(res.data){
                          $scope.post.title = $scope.temp.title;
                          $scope.post.content = $scope.temp.content;
                          Materialize.toast('Changes successfully saved!', 2000, 'custom-toast');
                          $scope.editMode = !$scope.editMode;
                      }
                      else{
                          console.log("Error while editing question!");
                      }
                  },
                  function(err){
                      console.log("Error while editing question!");
                  }
              );

            }


            $scope.incrementUpvotes = function(inc) {
              if(!$scope.currentUser){
                $scope.showLogin();
                return;
              }
              if(inc == 1){
                  if($scope.post.upvoted){
                      questionService.submitCancelUpvotePost($scope.post.id, $scope.currentUser.id, $scope.type)
                      .then(
                          function(res){
                              console.log(res);
                              if(res.data){
                                  $scope.post.upvotes--;
                                  $scope.post.upvoted = false;
                            }
                          },
                          function(err){

                          }
                      );
                  }
                  else {
                      if($scope.post.downvoted){
                          questionService.submitCancelDownvotePost($scope.post.id, $scope.currentUser.id, $scope.type)
                          .then(
                              function(res){
                                  console.log(res);
                                  if(res.data){
                                      $scope.post.upvotes++;
                                      $scope.post.downvoted = false;
                                }
                              },
                              function(err){

                              }
                          );
                      }
                      questionService.submitUpvotePost($scope.post.id, $scope.currentUser.id, $scope.type)
                      .then(
                          function(res){
                              console.log(res);
                              if(res.data){
                                  $scope.post.upvotes++;
                                  $scope.post.upvoted = true;
                            }
                          },
                          function(err){

                          }
                      );
                  }
              }
              else{
                  if($scope.post.downvoted){
                      questionService.submitCancelDownvotePost($scope.post.id, $scope.currentUser.id, $scope.type)
                      .then(
                          function(res){
                              console.log(res);
                              if(res.data){
                                  $scope.post.upvotes++;
                                  $scope.post.downvoted = false;
                            }
                          },
                          function(err){

                          }
                      );
                  }
                  else{
                      if($scope.post.upvoted){
                          questionService.submitCancelUpvotePost($scope.post.id, $scope.currentUser.id, $scope.type)
                          .then(
                              function(res){
                                  console.log(res);
                                  if(res.data){
                                      $scope.post.upvotes--;
                                      $scope.post.upvoted = false;
                                }
                              },
                              function(err){

                              }
                          );
                      }
                      questionService.submitDownvotePost($scope.post.id, $scope.currentUser.id, $scope.type)
                      .then(
                          function(res){
                              console.log(res);
                              if(res.data){
                                  $scope.post.upvotes--;
                                  $scope.post.downvoted = true;
                            }
                          },
                          function(err){

                          }
                      );
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
                            console.log("Error in removing tag from question!");
                        }
                    },
                    function(err){
                        console.log("Error while deleting tag from the question!");
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
                            console.log("Error in adding data to question!");
                        }
                    },
                    function(err){
                        console.log("Error while adding tag to the question!");
                    }
                );
            }
        },
        link : function(scope, element, attrs){
            scope.type = attrs.type;
            scope.showFooter = "showFooter" in attrs;

            
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
