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
        controller: function($http, $scope, $state, $rootScope, $timeout){
            $scope.editMode = false;
            $scope.includeTags = false;
            $scope.includeTitle = false;
            $scope.linkToQuestionPage = false;
            $scope.includeAuthorFlavor = false;
            $scope.showFooter = false;

             // Edit here plx!
            var submitAnswerToServer = function(post, dangerousHTML){
              // console.log('hi');
              var userID;
              FB.getLoginStatus(function(resp) {
                if (resp.status == 'connected') {
                  FB.api('/me', function(response) {
                    userID = response.id;
                    // console.log('userID is:');
                    // console.log(userID);
                    var answersURL = "/server/answers.php";
                    var questionID = post.id;
                    $http({
                      method: 'POST',
                      url: answersURL,
                      data: {
                        cmd: "createanswer",
                        user_id: userID,
                        question_id: questionID,
                        content: dangerousHTML
                      },
                      dataType: 'json'
                    }).success(function() {
                      console.log('hahaha');
                      $window.location.reload();
                    });
                  });
                }
              });
              // var userID = 1;
              // console.log("sending ...", dangerousHTML);
            }

            // Here goes user on submit click
            $scope.submit = function(post){

                submitAnswerToServer(post, $('.wysiwyg-editor').trumbowyg('html'));

                //clean up
                $('.wysiwyg-editor').trumbowyg('empty')
                $scope.showTextEditor = !$scope.showTextEditor;
            }

            $scope.toggleFooter = function(){
                $scope.showFooter = !$scope.showFooter;
            }

            $scope.incrementUpvotes = function(post, inc) {
              var cmd;
               if (inc == 1) {
                 post.score++;
                 cmd = "set_up_vote_qns";
               } else {
                 post.score--;
                 cmd = "set_down_vote_qns";
               }
               $http({
                 method: "POST",
                 url: "/server/questions.php",
                 data: {
                   cmd: cmd,
                   qns_id: post.id,
                   user_id: loggedInUserID
                 }
               }).success(function() {
                 console.log('success');
               });
            };

            $scope.removeTag = function(tag){
                $scope.post.tags = $scope.post.tags.filter(function(el){return el !== tag;});
                //TODO: communicate with back-end
            }

            $scope.addTag = function(tag){
                //TODO: implement addTag functionality
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
