/*This is the uppermost controller.*/
angular.module('quoraApp')
.controller('MainCtrl', ['ezfb', '$scope', 'questionService', '$rootScope', '$state', '$timeout', function(ezfb, $scope, qs, $rootScope, $state, $timeout){

    $scope.loading = true;
    // $scope.currentUser = { userID : "10209460093644289" };
    ezfb.getLoginStatus(function (res) {
      $scope.loginStatus = res;

      ezfb.api('/me',function (res) {
        $scope.apiMe = res;
        qs.getCurrentUser($scope.apiMe.id).then(function(data) {
          $scope.currentUser = data.data;
          console.log($scope.currentUser);
        })
        $scope.loading = false;
      });
    });

    // SET ME TO FALSE AFTER ASYNC DATA HAS LOADED, THIS IS HARDCODED!
    /*$timeout(function(){
        $scope.loading = false;
    }, 1500)*/

    /*TODO: back-end integration
        "post" should actually be "postID". The post, with its associated
        comments and answers, must be retrieved from the server and passed as a
        state parameter.
    */
    $scope.goToPost = function(post){
        $state.go('qa', {'currPost' : post});
    }

    //TODO: implement goToProfile function
    $scope.goToProfile = function(post){
        //FIXME: this is just a simple placeholder to demonstrate functionality
        $state.go('profile', {'author' : post.author});
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
        // $scope.currentUser = {name : "root", karma : 9999, userid : 0, flavor: "Administrator", profileImg : 'http://dummyimage.com/300/09.png/fff'};
        $('#login-modal').closeModal();
    }

    //TODO: get currentUser from database by logging in.

    qs.getQuestions().then(function (returnedData) {
      $scope.loading = false;
      console.log(returnedData);
      $scope.posts = returnedData.data;
    });
    $scope.notifications = qs.getNotifications();
    qs.submitGetTrendingTags().then(function(data) {
      $scope.trendingTags = data.data;
    });
}]);
