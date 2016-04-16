/** We need to wrap all the jQuery events inside angular directives for them to 
    trigger after our angular code has loaded */
angular.module('quoraApp')

.directive('nav', function(){
	return {
		restrict:'E',
		link:function(scope, element, attributes){
			$('.dropdown-button').dropdown({
		      inDuration: 300,
		      outDuration: 225,
		      hover: true, // Activate on hover
		      belowOrigin: true, // Displays dropdown below the button
		      alignment: 'right' // Displays dropdown with edge aligned to the left of button
		    }
		  );

		}
	}
})

.directive('body', function(){
	return {
		restrict:'E',
		controller: function($scope, $timeout){

			$('html').click(function(){
				if( $('#search').is(':focus')) {
					$scope.user_question = "?";
					$timeout(function(){
						$('#search').get(0).setSelectionRange(0,0);
					}, 0)
					$scope.showOverlay = true;
				} else {
					if(!$scope.submitQuestionError){
						$scope.user_question = "";
						$scope.showOverlay = false;
						$scope.showQuestionError = false;
					}
				}	

				$scope.$apply(); 
			});


		},
		link:function(scope, element, attributes){
			
		}
	}
})
