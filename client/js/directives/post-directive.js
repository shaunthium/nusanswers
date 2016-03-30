'use strict'
angular.module('quoraApp')

.directive('post', function($window){

	return {
		restrict: 'E',
		transclude: true,
		templateUrl : "templates/post-template.html"
	}

})