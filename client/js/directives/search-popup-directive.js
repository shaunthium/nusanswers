angular.module('quoraApp')

.directive('searchPopup', function($window){

	return {

		restrict: 'E',
		link: function(scope, element, attrs){

			element.css('left', document.getElementById("search-field").getBoundingClientRect().left);
			
			angular.element($window).bind('resize', function(){

				element.css('left', document.getElementById("search-field").getBoundingClientRect().left);
				scope.$digest();

			})

		}

	}

})