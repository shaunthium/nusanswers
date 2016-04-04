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
        controller: function($scope, $state, $rootScope){
            $scope.includeTags = false;
            $scope.includeTitle = false;
            $scope.linkToQuestionPage = false;
            $scope.includeViews = false;

            $scope.toggleFooter = function(){
                $scope.showFooter = !$scope.showFooter;
            }

            $scope.incrementUpvotes = function(post, inc) {
        	  post.upvotes += inc;
        	};

            //TODO: implement goToProfile function
            $scope.goToProfile = function(post){
                //FIXME: this is just a simple placeholder to demonstrate functionality
                $state.go('profile', {'author' : post.author});
            }
        },
        link : function(scope, element, attrs){
            scope.type = attrs.type;
            scope.showFooter = attrs.showFooter == "true" ? true : false;
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
