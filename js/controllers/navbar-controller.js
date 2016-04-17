/*
    The navbar controller should control:
        + searchfield
        + searchfield popup
        + notifications
        + profile button
        + home button
*/
angular.module('quoraApp')
.controller('NavCtrl', ['$scope', '$timeout', 'questionService', '$location', '$rootScope', 'questionTitleFilter', function($scope, $timeout, qs, $location, $rootScope, questionTitleFilter){
    $scope.showOverlay = false;

    /**
        This function creates a post object from the input string captured in the searchfield.

        + The user_input string is sent to the server to be stored in the database.
        + The server now replies with the post object which now INCLUDES POST ID.
            This is important because that is how we will identify questions when adding commments/upvote/etc.

    */
    //TODO: maximum question length
    $scope.submitQuestion = function(title_string){

        if (!$scope.currentUser){
            // console.log("asadasda");
            $scope.showLogin();
            return;
        }
        else if($scope.showQuestionError){
            $scope.submitQuestionError = true;
            $timeout(function(){
                $scope.submitQuestionError = false;
            }, 100);
            return; //Do not allow submission if an error is being shown. No need for additional error messages.
        }
        // Should never happen now
        else if(!title_string){
            return;
        } //Prevent a null post

        //Prevent the question from being too short
        else if(title_string.length < QUESTION_TITLE_MIN_LENGTH){
            $scope.submitQuestionError = true;
            $scope.displayErrorMessage("Error: the question is too short!");
            $timeout(function(){
                $scope.submitQuestionError = false;
            }, 100);
            return;
        }
        else if(title_string.charAt(title_string.length - 1) != "?"){
            $scope.submitQuestionError = true;
            $scope.displayErrorMessage("Error: the question should end with a question mark!");
            $timeout(function(){
                $scope.submitQuestionError = false;
            }, 100);
            return;
        }
        console.log(title_string.charAt(title_string.length -1));



        $scope.userInput = "";
        $scope.showOverlay = false; //Hide shading box
        //$scope.goToPost($scope.newPost(user_question));
        // console.log("trying to send " , title_string);
        //user_id, title, content
        qs.submitNewPost($scope.currentUser.id, title_string)
        .then(function(res){

            // Materialize.toast('Yay, question asked! :)', 2000, 'custom-toast')
            // console.log("Successfully submitted question", res);
            //$state.go('qa', {'currPost' : res.data[0]});
            $location.path('/qa/' + res.data[0].id);
        }, function(err){
          // console.log("Couldn't post new question", err);
        })
    }

    $scope.displayErrorMessage = function(msg){
        $scope.showQuestionError = true;
        $scope.errorMessage = msg;
    }

    $scope.clearErrorMessage = function(){
        $scope.showQuestionError = false;
        $scope.errorMessage = "";
    }

    $scope.toggleOverlay = function(){
      $scope.submitQuestionError = false;
      $('#search').focus();
    }

    $scope.searchfieldFocused = function(){
        $scope.userInput = "?";
        //This timeout moves the mouse cursor before the question mark...
        $timeout(function(){
            $('#search').get(0).setSelectionRange(0,0);
        }, 0);
        $scope.showOverlay = true;
    }

    $timeout(function(){
       $('.button-collapse').sideNav({
          menuWidth: 300, // Default is 240
          edge: 'right', // Choose the horizontal origin
          closeOnClick: true // Closes side-nav on <a> clicks, useful for Angular/Meteor
        });
    }, 100)

}]);
