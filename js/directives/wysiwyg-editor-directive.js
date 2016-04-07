'use strict'
angular.module('quoraApp')
.directive('wysiwygEditor', function($window){
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

            // TODO: Edit here plx!
           $scope.submitAnswerToServer = function(dangerousHTML){
               console.log("sending ...", dangerousHTML);
           }

           // TODO: Here goes user on submit click
           $scope.submit = function(){
               $scope.submitAnswerToServer($('#wysiwyg-editor-' + $scope.editorId).trumbowyg('html'));
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
});
