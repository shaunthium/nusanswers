/*
    The navbar controller should control:
        + searchfield
        + searchfield popup
        + notifications
        + profile button
        + home button
*/
angular.module('quoraApp')
.controller('NavCtrl', ['$scope', '$timeout', 'questionService', '$location', function($scope, $timeout, qs, $location){
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

        else if (!$scope.currentUser){
            console.log("asadasda");
            $scope.showLogin();
            return;
        }

        $scope.title_string = "";
        $scope.showOverlay = false; //Hide shading box
        //$scope.goToPost($scope.newPost(user_question));
        console.log("trying to send " , title_string);
        //user_id, title, content
        qs.submitNewPost($scope.currentUser.id, title_string)
        .then(function(res){
            console.log("Successfully submitted question", res);
            //$state.go('qa', {'currPost' : res.data[0]});
            $location.path('/qa/' + res.data[0].id);
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
