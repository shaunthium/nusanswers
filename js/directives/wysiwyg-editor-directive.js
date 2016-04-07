'use strict'
angular.module('quoraApp')
.directive('wysiwygEditor', ['$http', '$window', function($http, $window){
    return {
        restrict : 'E',
        scope : true,
        controller : function($scope){
            $scope.$watch(function(){
                return $scope.showFooter;
            },
            function(showFooter){
                if(showFooter){
                    console.log("Show footer! " + $scope.editorId);
                    $('#wysiwyg-editor-' + $scope.editorId).trumbowyg({
                        fullscreenable: false,
                        btns:['bold', 'italic']
                    });
                }
            });

            var submitAnswerToServer = function(post, dangerousHTML){
              var answersURL = "/server/answers.php";
              var questionID = post.id;
              $http({
                method: 'POST',
                url: answersURL,
                data: {
                  cmd: "createanswer",
                  user_id: loggedInUserID,
                  question_id: questionID,
                  content: dangerousHTML
                },
                dataType: 'json'
              }).success(function() {
                console.log('hahaha');
              });
              // console.log('hi');
              // var userID;
              // FB.getLoginStatus(function(resp) {
              //   if (resp.status == 'connected') {
              //     FB.api('/me', function(response) {
              //       userID = response.id;
              //       console.log('userID is:');
              //       console.log(userID);
              //       var answersURL = "/server/answers.php";
              //       var questionID = post.id;
              //       $http({
              //         method: 'POST',
              //         url: answersURL,
              //         data: {
              //           cmd: "createanswer",
              //           user_id: userID,
              //           question_id: questionID,
              //           content: dangerousHTML
              //         },
              //         dataType: 'json'
              //       }).success(function() {
              //         console.log('hahaha');
              //       });
              //     });
              //   }
              // });
              // // var userID = 1;
              // console.log("sending ...", dangerousHTML);
            }

           // TODO: Here goes user on submit click
           $scope.submit = function(post){
               submitAnswerToServer(post, $('#wysiwyg-editor-' + $scope.editorId).trumbowyg('html'));
               //clean up
               $('#wysiwyg-editor-' + $scope.editorId).trumbowyg('empty');
               $scope.toggleFooter();
           }

            $scope.toggleTextEditor = function(editorId){
                $scope.toggleFooter();
            }
        },
        link : function(scope, elems, attrs){
            scope.editorId = attrs.editorId;
        },
        templateUrl:"templates/wysiwyg-editor-template.html"
    }
}]);
