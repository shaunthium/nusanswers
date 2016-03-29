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

			angular.element($window).on('scroll', function(){

				console.log($window.scrollY);
				element.css('margin-top', scrollY);
				var overlayOffsetTop = document.getElementById("overlay-container").offsetTop;
				document.getElementById("overlay-container").style.top = (scrollY) + "px";

			})

		},
		templateUrl:"templates/search-popup-template.html"
	}
})