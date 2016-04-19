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
                    $scope.editorProfileImg = data.data.url;
                  }).error(function(data) {
                    $scope.editorProfileImg = 'http://dummyimage.com/300/09.png/fff';
                  });
                }
            });

            // TODO: Here goes user on submit click
            $scope.submit = function(post){

                if($('#wysiwyg-editor-' + $scope.editorId).trumbowyg('html').length < 10){
                    Materialize.toast("Your answer is too short!", 2000, 'information-toast');
                    return;
                }

                questionService.submitAnswerToPost(post.id, $scope.currentUser.id, $('#wysiwyg-editor-' + $scope.editorId).trumbowyg('html'))
                .then(function(res){
                    if(res.data.length > 0){
                        Materialize.toast('Question answered! :)', 2000, 'custom-toast');
                        // console.log("Successfully answered question", res.data);
                        $scope.post.total_answers++;
                        if(!$scope.post.answers){
                            $scope.post.answers = [];
                        }
                        $scope.post.answers.push(res.data[0]);
                        $scope.post.answered = true;
                        $('#wysiwyg-editor-' + $scope.editorId).trumbowyg('empty');
                    }
                    else{
                        $scope.toggleFooter();//Re-open the footer in case of an error
                        Materialize.toast("There was a problem submitting your answer to the server!", 2000, 'error-toast');
                    }
                }, function(err){
                  // console.log("Error in answering question", err);
                });
                $scope.toggleFooter(); //Close the footer to give the impression of speed.
                // submitAnswerToServer(post, $('#wysiwyg-editor-' + $scope.editorId).trumbowyg('html'));
                //clean up
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
