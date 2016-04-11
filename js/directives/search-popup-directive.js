angular.module('quoraApp')

.directive('searchPopup', function($window){

	return {
		restrict: 'E',
		link: function(scope, element, attrs){

			scope.mode = attrs.mode;

			element.css('left', document.getElementById("search-field").getBoundingClientRect().left);
			angular.element($window).bind('resize', function(){
				element.css('left', document.getElementById("search-field").getBoundingClientRect().left);
				scope.$digest();
			})

			angular.element($window).on('scroll', function(){
				element.css('margin-top', scrollY*(1/0.9));
				var overlayOffsetTop = document.getElementById("overlay-container").offsetTop;
				document.getElementById("overlay-container").style.top = (scrollY)*(1/0.9) + "px";
			})
		},
		templateUrl:"templates/search-popup-template.html"
	}
})
