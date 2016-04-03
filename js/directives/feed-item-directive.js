'use strict'
angular.module('quoraApp')

.directive('feedItem', function($window){

	return {
		restrict: 'E',
		transclude: true,
        controller: function($scope, $state, $rootScope){
			$scope.goToPost = function(question){
				$scope.user_question = "";
				$scope.showOverlay = false;
				$state.go('qa', {'currQuestion' : question});
			}
		},
		templateUrl : "templates/feed-item-template.html"
	}

})
