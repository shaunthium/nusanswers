/*
    The navbar controller should control:
        + searchfield
        + searchfield popup
        + notifications
        + profile button
        + home button
*/
angular.module('quoraApp')
.controller('NavCtrl', ['$scope', '$timeout', 'questionService', '$state', function($scope, $timeout, qs, $state){
    $scope.user_question = "";
    $scope.showOverlay = false;

    /**
        This function creates a post object from the input string captured in the searchfield.

        + The user_input string is sent to the server to be stored in the database.
        + The server now replies with the post object which now INCLUDES POST ID.
            This is important because that is how we will identify questions when adding commments/upvote/etc.

    */
    //TODO: maximum question length
    $scope.submitQuestion = function(title_string){
        if(!title_string) return; //Prevent a null post
        $scope.title_string = "";
        $scope.showOverlay = false; //Hide shading box
        //$scope.goToPost($scope.newPost(user_question));
        console.log("trying to send " , title_string);
        //user_id, title, content
        qs.submitNewPost($scope.currentUser.id, title_string)
        .then(function(res){
            console.log("Successfully submitted question", res);
            console.log("res data in navbar ctrl", res);
            $state.go('qa', {'currPost' : res.data[0]});
        }, function(err){
          console.log("Couldn't post new question", err);
        })
    }

    $scope.toggleOverlay = function(){
      $('#search').focus();
    }

    $timeout(function(){
       $(".button-collapse").sideNav();
    }, 500)

}]);
