'use strict'
angular.module('quoraApp')
.directive('wysiwygEditor', ['$http', '$window', function($http, $window){
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
                        console.log(res)
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
