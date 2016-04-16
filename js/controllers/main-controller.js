/*This is the uppermost controller.*/
angular.module('quoraApp')
.controller('MainCtrl', ['ezfb', '$scope', 'questionService', '$rootScope', '$state', '$timeout', '$location', function(ezfb, $scope, qs, $rootScope, $state, $timeout, $location){
    $scope.posts = [];
    $scope.loading = true;

    // $rootScope.currentUser = { id : "1" , first_name : "DummyUser"};

    ezfb.getLoginStatus(function (res) {
      $scope.loginStatus = res;
      if (res.status == 'connected') {
        ezfb.api('/me',function (res) {
          $scope.apiMe = res;
          qs.getCurrentUser($scope.apiMe.id, $scope.loginStatus.authResponse.accessToken).then(function(data) {
            $rootScope.currentUser = data.data;
            $scope.loading = false;
          });
        });
      } else {
        $rootScope.currentUser = null;
        $scope.loading = false;
      }
    });

    /*TODO: back-end integration
        "post" should actually be "postID". The post, with its associated
        comments and answers, must be retrieved from the server and passed as a
        state parameter.
    */
    $scope.goToPost = function(post){
        //$state.go('qa', {'currPost' : post});
        $location.path('/qa/' + post.id);
        // console.log("going to post", post);
       // $location.path('qa').search({id: post.id});
    }

    //TODO: implement goToProfile function
    $scope.goToProfile = function(post){
        //FIXME: this is just a simple placeholder to demonstrate functionality
        // $state.go('profile', {'author' : post.author});
        $location.path('/profile/' + post);
    }

    $scope.showLogin = function(){
      $('#login-modal').openModal();
    }

    // Do your magic here shaun
    $scope.makeFacebookLogin = function(){
    // $rootScope.currentUser = { id : "10209460093644289" , first_name : "DummyUser"};
        ezfb.login(function(res) {
          $scope.loginStatus = res;
          if (res.status == 'connected') {
            ezfb.api('/me',function (res) {
              $scope.apiMe = res;
              qs.getCurrentUser($scope.apiMe.id, $scope.loginStatus.authResponse.accessToken).then(function(data) {
                $rootScope.currentUser = data.data;
                // console.log($scope.currentUser);
                // $scope.loading = false;
                // console.log($scope.currentUser);
              });
            });
          }
        }, {scope: 'public_profile,email'});

        $('#login-modal').closeModal();
        Materialize.toast('Welcome back, ' + $rootScope.currentUser.first_name, 2000, 'custom-toast')
    }

    //TODO: get currentUser from database by logging in.
    $scope.updateQuestionsFeed = function(startIndex, requestedQuestions, userID){
        $scope.doneUpdatingFeed = false;
        qs.getQuestions(startIndex, requestedQuestions, userID).then(
            function (returnedData) {
                // $scope.loading = false;
                $scope.posts = $scope.posts.concat(returnedData.data);
                $scope.doneUpdatingFeed = true;
            },
            function(err){
                console.log("Error while updating the questions feed!");
            });
    }

    $scope.resetQuestionsFeed = function(){
        $scope.loading = true;
        $scope.posts = [];
    }

    $scope.getPost = function(questionID, userID){
        $scope.loading = true;
        qs.getPost(questionID, userID)
        .then(function(res){
            $scope.post = res.data.question;
            if(!$scope.post){
                //TODO: remember to set $scope.loading = false when switching to 404 page.
                console.log("NO POST IN DB, SHOW 404 NOT FOUND ");
            } else {
                qs.getAnswersToCurrentPost($scope.post.id)
                .then(function(res){
                    //TODO: we will need a "numAnswers" field in the post object in order to get the number of answers if we want to implement infinite scroll on answers as well.
                    $scope.post.answers = res.data.answers;
                    if($scope.post.answers.length > 0)
                    $scope.numAnswers = $scope.post.answers.length;
                    else
                    $scope.numAnswers = 0;
                    $scope.loading = false;
                }, function(err){

                });
            }
        }, function(err){

        });
    }

    $scope.notifications = qs.getNotifications();
    qs.submitGetTrendingTags().then(function(data) {
      $scope.trendingTags = data.data;
    });
}]);
