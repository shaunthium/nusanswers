/*This is the uppermost controller.*/
angular.module('quoraApp')
.controller('MainCtrl', ['ezfb', '$scope', 'questionService', '$rootScope', '$state', '$timeout', '$location', function(ezfb, $scope, qs, $rootScope, $state, $timeout, $location){

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

    $scope.newPost = function(title){
        return qs.submitNewPost(title, $scope.currentUser);
    }

    /*
        postID: identifies the post. FIXME: what does the server need to identify the post?
        body: body of the comment
    */
    $scope.newComment = function(postID, body){
        //FIXME: should we send the entire user object? the userid? the name?
        return qs.submitNewComment(postID, body, $scope.currentUser);
    }

    //FIXME: HOW DO WE IDENTIFY COMMENTS WITHIN ANSWERS?
    $scope.deleteComment = function(postID, commentID){
        return qs.submitDeleteComment(postID, commentID);
    }

    //FIXME: HOW DO WE IDENTIFY COMMENTS WITHIN ANSWERS?
    $scope.reportComment = function(postID, commentID){
        return qs.submitReportComment(postID, commentID, $scope.currentUser);
    }

    //FIXME: HOW DO WE IDENTIFY COMMENTS WITHIN ANSWERS?
    $scope.cancelReportComment = function(postID, commentID){
        return qs.submitCancelReportComment(postID, commentID, $scope.currentUser);
    }

    $scope.reportPost = function(postID){
        return qs.submitReportPost(postID, $scope.currentUser);
    }

    $scope.cancelReportPost = function(postID){
        return qs.submitCancelReportPost(postID, $scope.currentUser);
    }

    $scope.upvotePost = function(postID){
        return qs.submitUpvotePost(postID, $scope.currentUser);
    }

    $scope.cancelUpvotePost = function(postID){
        return qs.submitCancelUpvotePost(postID, $scope.currentUser);
    }

    $scope.downvotePost = function(postID){
        return qs.submitDownvotePost(postID, $scope.currentUser);
    }

    $scope.cancelDownvotePost = function(postID){
        return qs.submitCancelDownvotePost(postID, $scope.currentUser);
    }

    //FIXME: HOW DO WE IDENTIFY COMMENTS WITHIN ANSWERS?
    $scope.upvoteComment = function(postID, commentID){
        return qs.submitUpvoteComment(postID, commentID, $scope.currentUser);
    }

    //FIXME: HOW DO WE IDENTIFY COMMENTS WITHIN ANSWERS?
    $scope.cancelUpvoteComment = function(postID, commentID){
        return qs.submitCancelUpvoteComment(postID, commentID, $scope.currentUser);
    }

    //FIXME: HOW DO WE IDENTIFY COMMENTS WITHIN ANSWERS?
    $scope.downvoteComment = function(postID, commentID){
        return qs.submitDownvoteComment(postID, commentID, $scope.currentUser);
    }

    //FIXME: HOW DO WE IDENTIFY COMMENTS WITHIN ANSWERS?
    $scope.cancelDownvoteComment = function(postID, commentID){
        return qs.submitCancelDownvoteComment(postID, commentID, $scope.currentUser);
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
    }

    //TODO: get currentUser from database by logging in.

    qs.getQuestions().then(function (returnedData) {
        $scope.loading = false;
      // console.log(returnedData);
      $scope.posts = returnedData.data;
    });
    $scope.notifications = qs.getNotifications();
    qs.submitGetTrendingTags().then(function(data) {
      $scope.trendingTags = data.data;
    });
}]);
