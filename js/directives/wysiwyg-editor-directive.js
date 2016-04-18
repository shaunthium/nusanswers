'use strict'
angular.module('quoraApp')
.directive('wysiwygEditor', ['$rootScope','$http', '$window', function($rootScope, $http, $window){
    return {
        restrict : 'E',
        scope : true,
        controller : function($scope, questionService){
            $scope.$watch(function(){
                return $scope.showFooter;
            },
            function(showFooter){
                if(showFooter){
                    // console.log("Show footer! " + $scope.editorId);
                    $('#wysiwyg-editor-' + $scope.editorId).trumbowyg({
                        fullscreenable: false,
                        btns:['bold', 'italic']
                    });
                }
            });

            $scope.$watchCollection(function(){
                return $scope.currentUser;
            },
            function(currentUser){
                // console.log(currentUser);
                if(currentUser){
                  $http({
                    url: 'http://graph.facebook.com/v2.5/' + currentUser.id + '/picture?redirect=false&width=9999',
                    method: 'GET',
                    data: {
                      width: '1000'
                    }
                  }).success(function(data) {
                    $scope.answerProfileImg = data.data.url;
                  }).error(function(data) {
                    $scope.answerProfileImg = 'http://dummyimage.com/300/09.png/fff';
                  });
                }
            });

            // TODO: Here goes user on submit click
            $scope.submit = function(post){

                if($('#wysiwyg-editor-' + $scope.editorId).trumbowyg('html').length < 10){
                    Materialize.toast("Your answer is too short!", 2000, 'information-toast');
                    return;
                }

                Materialize.toast('Question answered! :)', 2000, 'custom-toast')
                questionService.submitAnswerToPost(post.id, $scope.currentUser.id, $('#wysiwyg-editor-' + $scope.editorId).trumbowyg('html'))
                .then(function(res){
                    // console.log("Successfully answered question", res.data);
                    $scope.post.total_answers++;
                    if(!$scope.post.answers){
                        $scope.post.answers = [];
                    }
                    // console.log(res)
                    $scope.post.answers.push(res.data[0]);
                    $scope.post.answered = true;
                }, function(err){
                  // console.log("Error in answering question", err);
                });
                // submitAnswerToServer(post, $('#wysiwyg-editor-' + $scope.editorId).trumbowyg('html'));
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
