'use strict'
angular.module('quoraApp')

.directive('feedItem', function($window){

	return {
		restrict: 'E',
		transclude: true,
		templateUrl : "templates/feed-item-template.html"
	}

})