/*
    The navbar controller should control:
        + searchfield
        + searchfield popup
        + notifications
        + profile button
        + home button
*/
angular.module('quoraApp')
.controller('NavCtrl', ['$scope', '$timeout', function($scope, $timeout){
    $scope.user_question = "";
    $scope.showOverlay = false;

    /**
        This function creates a post object from the input string captured in the searchfield.

        + The user_input string is sent to the server to be stored in the database.
        + The server now replies with the post object which now INCLUDES POST ID.
            This is important because that is how we will identify questions when adding commments/upvote/etc.

    */
    //TODO: maximum question length
    $scope.submitQuestion = function(user_question){
        if(!user_question) return; //Prevent a null post
        $scope.user_question = "";
        $scope.showOverlay = false; //Hide shading box
        $scope.goToPost($scope.newPost(user_question));
    }


    $timeout(function(){

       $(".button-collapse").sideNav();
       $scope.$apply();

    }, 500)




}]);
