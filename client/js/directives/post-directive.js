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
        controller: function($scope){
            $scope.incrementUpvotes = function(post, inc) {
        	  post.upvotes += inc;
        	};
        },
        link : function(scope, element, attrs){
            scope.type = attrs.type;
        },
		templateUrl : "templates/post-template.html"
	}

})
