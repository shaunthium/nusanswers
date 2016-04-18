'use strict'
angular.module('quoraApp')
.directive('tagInputField', function($window){
	return {
		restrict: 'E',
        scope: true,
        controller : function($scope){
            $scope.suggestedTags = [];
            $scope.$watch(function(){
                return $scope.userInput;
            },
            function(userInput){
                $scope.suggestedTags = [];
                if(userInput && $scope.allTags){
                    $scope.allTags.forEach(function(tag){
                        var relevance = 0;
                        //If the tag contains userInput
                        if(~tag.toUpperCase().indexOf(userInput.toUpperCase())){
                            if(tag.toUpperCase() === userInput.toUpperCase()){
                                relevance += 10;
                            }
                            $scope.suggestedTags.push({tag:tag, relevance:relevance + userInput.length});
                        }
                    });
                    $scope.suggestedTags = $scope.suggestedTags.sort(function(a, b){
                        return b.relevance - a.relevance; //Sort by most relevant first
                    });
                }
            });

            $scope.clearUserInput = function(){
                $scope.userInput = "";
            }

            //XXX: this function breaks when adding dual characters, such as '^' + 'n' in the English International Keyboard.
            $scope.verifyTag = function(){
                //Filter out any character that is not a-z A-Z 0-9 and remove continuous spaces
                var filtered = $scope.userInput.replace(/\W/g, " ").replace(/_/g, " ").replace(/ +/g, " ");
                if(filtered !== $scope.userInput){
                    Materialize.toast("Tags can only contain characters a-z A-Z 0-9!", 2000, 'error-toast');
                    $scope.userInput = filtered.trim();
                    return;
                }
                var tokens = filtered.split(" ");
                if(tokens.length > 1 && tokens[0].length > 0){ //If a valid tag exists
                    if(!~$scope.post.tags.indexOf(tokens[0])){ //If the tag has not been added
                        $scope.addTag(tokens[0]);
                    }
                    $scope.userInput = tokens[1];
                }
            }

            //FIXME: this function does not capture the "TAB" key.
            $scope.keyPressed = function($event){
                var key_enter = 13;
                var key_tab = 9;
                if($event.which === key_enter || $event.which === key_tab){
                    $scope.userInput += " "; //Emulate a space press
                    $scope.verifyTag();
                }
            }
        },
		link: function(scope, element, attrs){
            scope.placeholder = "Add tags to your question! Submit with enter or space!";
		},
		templateUrl: 'templates/tag-input-field-template.html'
	}
});
