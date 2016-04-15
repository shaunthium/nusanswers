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

			/*angular.element($window).on('scroll', function(){
				var overlayOffsetTop = document.getElementById("overlay-container").offsetTop;
				document.getElementById("overlay-container").style.top = (scrollY)*(1/0.9) + "px";
			})*/
		},
		
		/* WARNING HACKY FIX - not in templateUrl due to templateCache and animation wont trigger the first time */
		template: '<div ng-if="user_question">' + 
						'<div class = "suggestion-box-info">' +
						  '<p class="v-align grey-text" style="font-size:0.9em;padding:0px; margin:0px; text-align:center;">' +
						      'Search for content lah' +
						  '</p>' + 
						'</div>' +

						'<div ng-click="goToPost(post)" ng-repeat = "post in filteredPosts  = (posts | filter:user_question)" class="search-result-container">' +
						  '<p style="margin:0;padding:0px;" >' +
						    '<b>Post:</b> {{post.title}}' +
						  '</p>' +
						'</div>' +

						'<p style="text-align:center;" ng-hide="filteredPosts.length">No results found!</p>' + 
					'</div>' + 

					'<div ng-if="!user_question">' +
						'<div style="height:100px; padding:10px;">' +
							'<div style="text-align:center;" class="v-align">' + 
								'<span class="v-align">' +
									'<b>What\'s your question?</b><br/>' +
									'Ask a question about anything related to NUS.' +
								'</span>' +
							'</div>' +
						'</div>' +
					'</div>' 

	}
})
