'use strict'
angular.module('quoraApp')

.directive('comment', function($window){

	return {
		restrict: 'E',
		transclude: true,
		link: function(scope, element, attrs){
			scope.upvotes = attrs.upvotes;
			scope.user = attrs.user;
		},
		templateUrl : "templates/comment-template.html"

	}

})