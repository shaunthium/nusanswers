angular.module('quoraApp')
.filter('search', function(){
    return function(questionsSummary, userInput){
        if(!userInput || typeof userInput !== 'string'){
            questionsSummary.forEach(function(post){
                post.relevance = 0;
            });
            return questionsSummary;
        }
        userInput = userInput.replace(/\W/g, " ").replace(/_/g, " ").replace(/ +/g, " "); //Get rid of non-word characters for the sake of search.
        var tagMatchScore = 3;
        var tagContainsScore = 0;
        var titleMatchScore = 20;
        var titleContainsScore = 1;
        var usernameMatchScore = 10;
        var usernameContainsScore = 5;

        var inputTokens = userInput.split(" "); //Tokenize the string
        return questionsSummary.filter(function(post){
            var relevance = 0;
            //Foreach tag that matches a token
            inputTokens.forEach(function(token){
                //Check tags
                post.tags.forEach(function(tag){
                    if(tag.toUpperCase() === token.toUpperCase()){              //If exact tag match
                        relevance += tagMatchScore;
                    }
                    else if(~tag.toUpperCase().indexOf(token.toUpperCase())){   //If partial tag match
                        relevance += tagContainsScore;
                    }
                });

                //Check title
                if(~post.title.toUpperCase().indexOf(token.toUpperCase())){
                    relevance += titleContainsScore;    //If partial title match
                }
            });

            if(post.title.toUpperCase() === userInput.toUpperCase()){
                relevance += titleMatchScore;               //If the title is an exact match
            }

            post.relevance = relevance;
            return relevance !== 0;
        });
    }
})
.directive('searchPopup', function($window){

	return {
		restrict: 'E',
        scope : false,
        controller : ['$scope', 'searchFilter', 'questionTitleFilter', function($scope, searchFilter, questionTitleFilter){
            $scope.relevantPosts = [];

            $scope.$watch(function(){
                return $scope.userInput;
            },
            function(userInput){
                if(userInput !== questionTitleFilter(userInput)){
                    $scope.displayErrorMessage("Your question contains invalid characters!");
                }
                else{
                    $scope.clearErrorMessage();
                    if(userInput !== "?"){
                        $scope.showSuggestions = true;
                    }
                    else{
                        $scope.showSuggestions = false;
                    }
                    if($scope.questionsSummary){
                        $scope.relevantPosts = searchFilter($scope.questionsSummary, userInput).sort(function(a, b){
                            return b.relevance - a.relevance; //Sort by most relevant first
                        });
                    }
                }
            });
        }],
		link: function(scope, element, attrs){
			scope.mode = attrs.mode;

			element.css('left', document.getElementById("search-field").getBoundingClientRect().left);
			angular.element($window).bind('resize', function(){
				element.css('left', document.getElementById("search-field").getBoundingClientRect().left);
				scope.$digest();
			});

			/*angular.element($window).on('scroll', function(){
				var overlayOffsetTop = document.getElementById("overlay-container").offsetTop;
				document.getElementById("overlay-container").style.top = (scrollY)*(1/0.9) + "px";
			})*/
		},

		/* WARNING HACKY FIX - not in templateUrl due to templateCache and animation wont trigger the first time */
		template: '<div ng-if="showSuggestions && !showQuestionError">' +
						'<div class = "suggestion-box-info">' +
						  '<p class="v-align grey-text" style="font-size:0.9em;padding:0px; margin:0px; text-align:center;">' +
						      'Search for content' +
						  '</p>' +
						'</div>' +

						'<div ng-click="goToPost(post)" ng-repeat = "post in relevantPosts | limitTo:5" class="search-result-container">' +
						  '<p style="margin:0;padding:0px;">' +
						    '<b>Post:</b> {{post.title}}' +
						  '</p>' +
						'</div>' +

						'<p style="text-align:center;" ng-hide="relevantPosts.length">No results found!</p>' +
					'</div>' +

					'<div ng-if="!showSuggestions && !showQuestionError">' +
						'<div class="white" style="height:100px; padding:10px;">' +
							'<div style="text-align:center;" class="v-align">' +
								'<span class="v-align">' +
									'<b>What\'s your question?</b><br/>' +
									'Ask a question about anything related to NUS.' +
								'</span>' +
							'</div>' +
						'</div>' +
					'</div>' +

                    '<div ng-if="showQuestionError">' +
                        '<div class="yellow lighten-3" style="height:100px; padding:10px;">' +
                            '<div style="text-align:center;" class="v-align">' +
                                '<span class="v-align">' +
                                    '<b>Warning!</b><br/>' +
                                    '{{errorMessage}}' +
                                '</span>' +
                            '</div>' +
                        '</div>' +
                    '</div>'

	}
})
