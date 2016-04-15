/*This is the uppermost controller.*/
angular.module('quoraApp')
.controller('MainCtrl', ['ezfb', '$scope', 'questionService', '$rootScope', '$state', '$timeout', '$location', function(ezfb, $scope, qs, $rootScope, $state, $timeout, $location){
    $scope.posts = [];
    $scope.loading = true;

    /*ezfb.getLoginStatus(function (res) {

      $scope.loginStatus = res;
      // console.log($scope.loginStatus);
      if (res.status == 'connected') {
        ezfb.api('/me',function (res) {
          $scope.apiMe = res;
          // console.log($scope.apiMe);
          qs.getCurrentUser($scope.apiMe.id, $scope.loginStatus.authResponse.accessToken).then(function(data) {
          // qs.getCurrentUser(500, $scope.loginStatus.authResponse.accessToken).then(function(data) {
            // console.log(data);
            $scope.currentUser = data.data;
            $scope.loading = false;
            // console.log($scope.currentUser);
          });
        });
      } else {
        $scope.currentUser = null;
        $scope.loading = false;
      }
    });*/

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

        $scope.currentUser = { id : "10209460093644289" , first_name : "DummyUser"};

        // $scope.currentUser = { userID : "10209460093644289" };
        // ezfb.login(function(res) {
        //   // console.log(res);
        //   $scope.loginStatus = res;
        //   if (res.status == 'connected') {
        //     ezfb.api('/me',function (res) {
        //       $scope.apiMe = res;
        //       // console.log($scope.apiMe);
        //       // qs.getCurrentUser($scope.apiMe.id, $scope.loginStatus.authResponse.accessToken).then(function(data) {
        //       qs.getCurrentUser($scope.apiMe.id, $scope.loginStatus.authResponse.accessToken).then(function(data) {
        //         $scope.currentUser = data.data;
        //         // console.log($scope.currentUser);
        //         // $scope.loading = false;
        //         // console.log($scope.currentUser);
        //       });
        //     });
        //   }
        // }, {scope: 'public_profile,email'});

        $('#login-modal').closeModal();
        /*

        */
        $scope.posts = [];
        $scope.updateQuestionsFeed($scope.currentUser.id);
    }

    //TODO: get currentUser from database by logging in.
    $scope.updateQuestionsFeed = function(userID, index){
        qs.getQuestions(userID, index).then(
            function (returnedData) {
                $scope.loading = false;
                $scope.posts = $scope.posts.concat(returnedData.data);
            },
            function(err){
                console.log("Error while updating the questions feed!");
            });
    }

    $scope.updateQuestionsFeed();

    $scope.notifications = qs.getNotifications();
    qs.submitGetTrendingTags().then(function(data) {
      $scope.trendingTags = data.data;
    });
}]);
