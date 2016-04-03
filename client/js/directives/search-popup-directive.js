angular.module('quoraApp')

.directive('searchPopup', function($window){

	return {
		restrict: 'E',
		controller: function($scope, $state, $rootScope){
			$scope.goToPost = function(post){
				$scope.user_question = "";
				$scope.showOverlay = false;
				$state.go('post', {'currPost' : post})
			}

            //FIXME: why are the form and this function under the search-popup-directive?
            /**
                This function creates a question object from the input string captured in the searchfield.

                + The user_input string is sent to the server to be stored in the database.
                //TODO: check for duplicate questions before storing a new question
                + The server now replies with the question object which now INCLUDES QUESTION ID.
                    This is important because that is how we will identify questions when adding commments/upvote/etc.
                + The state is switched to currQuestion. The question object is passed.
                //TODO: currQuestion should receive the question object, unpack it and display it.
            */
            $scope.submitQuestion = function(){
                if(!$scope.user_question) return; //Prevent a null post
                /*FIXME: should we sanitize input before sending it to the server?*/
                //TODO: send $scope.user_input to the server
                //TODO: receive question from the server.
                /*FIXME: REMOVE HARDCODED DATA*/
                answer =  {
                                id: 600,
                                author:     {name:'Alex', karma:100},
                                desc:       "I am an answer.",
                                upvotes:    0,
                                comments:   [{author:'Eric', body:'Some comment content2222 ome comment content2233322', upvotes:1, liked : false, reported : false}]
                            };
                question =  {
                                id: 600,
                                title: $scope.user_question,
                                category:   "New post!",
                                author:     {name:'Alex', karma:100},
                                views:      9001,
                                desc:       "This is a new question description placeholder.",
                                upvotes:    0,
                                comments:   [{author:'Eric', body:'Some comment content2222 ome comment content2233322', upvotes:1, liked : false, reported : false}],
                                answers: [answer]
                            };
                $scope.user_question = ""; //Clear the search field
                $scope.showOverlay = false; //Hide shading box
                $state.go('qa', {'currQuestion' : question});
                /* END HARDCODED DATA*/

                // alert($scope.user_question);
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

		},
		templateUrl:"templates/search-popup-template.html"
	}
})
