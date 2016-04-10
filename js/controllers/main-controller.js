/*This is the uppermost controller.*/
angular.module('quoraApp')
.controller('MainCtrl', [ '$http', '$scope', 'questionService', '$rootScope', '$state', '$timeout', function($http, $scope, qs, $rootScope, $state, $timeout){

    $scope.loading = true;

    // SET ME TO FALSE AFTER ASYNC DATA HAS LOADED, THIS IS HARDCODED!
    $timeout(function(){
        $scope.loading = false;
    }, 100);

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

    //TODO: get currentUser from database by logging in.
    $timeout(function(){
      console.log(loggedInUserID);
        qs.getCurrentUser().then(function(data) {
          console.log('user is:');
          console.log(data);
          $scope.currentUser = data;
        });

    }, 3000);
    qs.getQuestions().then(function (returnedData) {
      console.log(returnedData);
      $scope.posts = returnedData.data;
    });
    $scope.notifications = qs.getNotifications();
    qs.submitGetTrendingTags().then(function(data) {
      console.log(data);
      $scope.trendingTags = data.data;
    });
}]);
