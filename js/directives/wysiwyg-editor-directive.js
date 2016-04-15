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

            var submitAnswerToServer = function(post, dangerousHTML){
                questionService.submitAnswerToPost(post.id, $scope.currentUser.id, dangerousHTML)
                .then(function(res){
                    // console.log("Successfully answered question", res.data);
                    $scope.post.total_answers++;
                    if(!$scope.post.answers){
                        $scope.post.answers = [];
                    }
                    $scope.post.answers.push(res.data[0]);
                    $scope.post.answered = true;
                }, function(err){
                    // console.log("Error in answering question", err);
                });
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
