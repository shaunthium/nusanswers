angular.module('quoraApp')

.directive('searchPopup', function($window){

	return {
		restrict: 'E',
		controller: function($scope, $state){
			$scope.goToPost = function(post){
				$scope.user_question = "";
				$state.go('post', {'currPost' : post})
			}
		},
		link: function(scope, element, attrs){

			element.css('left', document.getElementById("search-field").getBoundingClientRect().left);
			angular.element($window).bind('resize', function(){

				element.css('left', document.getElementById("search-field").getBoundingClientRect().left);
				scope.$digest();

			})

			angular.element($window).on('scroll', function(){
				
				element.css('margin-top', scrollY);
				var overlayOffsetTop = document.getElementById("overlay-container").offsetTop;
				document.getElementById("overlay-container").style.top = (scrollY) + "px";

			})

			$('html').click(function(){

				if(scope.user_question){
					scope.user_question = "";
					scope.$apply(); // since this event was triggered outside angular
				}

			});

		},
		templateUrl:"templates/search-popup-template.html"
	}
})