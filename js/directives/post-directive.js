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
        controller: function($scope, $state, $rootScope, $timeout){
            $scope.editMode = false;
            $scope.includeTags = false;
            $scope.includeTitle = false;
            $scope.linkToQuestionPage = false;
            $scope.includeViews = false;
            $scope.showTextEditor = false;

             // Edit here plx!
            var submitAnswerToServer = function(dangerousHTML){
                console.log("sending ...", dangerousHTML);
            }

            // Here goes user on submit click
            $scope.submit = function(){

                submitAnswerToServer($('.wysiwyg-editor').trumbowyg('html'));

                //clean up
                $('.wysiwyg-editor').trumbowyg('empty')
                $scope.showTextEditor = !$scope.showTextEditor;
            }

            $scope.toggleFooter = function(){
                $scope.showFooter = !$scope.showFooter;
            }

            $scope.incrementUpvotes = function(post, inc) {
        	  post.upvotes += inc;
        	};

            $scope.toggleTextEditor = function(){

                // ugly
                $timeout(function(){
                    $('.wysiwyg-editor').trumbowyg({
                        fullscreenable: false,
                        btns:['bold', 'italic']
                    });
                })

                $scope.showTextEditor = !$scope.showTextEditor;
            }

            //TODO: implement goToProfile function
            $scope.goToProfile = function(post){
                //FIXME: this is just a simple placeholder to demonstrate functionality
                $state.go('profile', {'author' : post.author});
            }

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

            //scope.showFooter = attrs.showFooter == "true" ? true : false;
            switch(attrs.type){
                case "feed-item":
                    scope.includeTags = true;
                    scope.includeTitle = true;
                    scope.linkToQuestionPage = true;
                    scope.includeViews = true;
                    break;
                case "question":
                    scope.includeTags = true;
                    scope.includeTitle = true;
                    scope.includeViews = true;
                    break;
                case "answer":
                    break;
            }
        },
		templateUrl : "templates/post-template.html"
	}

})
