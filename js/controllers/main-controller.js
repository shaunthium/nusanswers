/*This is the uppermost controller.*/
angular.module('quoraApp')
.filter('questionTitle', function(){
    return function(questionTitle){
        if(questionTitle){
            return questionTitle.replace(/[^\w \?\!\"\'\(\)\.]/g, "");
        }
        return questionTitle;
    }
})
.controller('MainCtrl', ['ezfb', '$scope', 'questionService', '$rootScope', '$state', '$timeout', '$location', function(ezfb, $scope, qs, $rootScope, $state, $timeout, $location){
    $scope.posts = [];
    $rootScope.loading = true;
    $scope.feedType = 'latest';

    $scope.setFeedType = function(type){
        $scope.feedType = type;
    }


    // $rootScope.currentUser = { id : "10209460093644289" , first_name : "DummyUser", profileImg : 'http://dummyimage.com/300/09.png/fff'};

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
                $http({
                  url: 'http://graph.facebook.com/v2.5/' + $rootScope.currentUser.id + '/picture?redirect=false&width=9999',
                  method: 'GET',
                  data: {
                    width: '1000'
                  }
                }).success(function(data) {
                  $scope.currentUser.profileImg = data.data.url;
                }).error(function(data) {
                  $scope.currentUser.profileImg = 'http://dummyimage.com/300/09.png/fff';
                });
                // console.log($scope.currentUser);
                $scope.loading = false;
                // console.log($scope.currentUser);
              });
            });
          }
        }, {scope: 'public_profile,email'});

        // $rootScope.currentUser = { id : "1" , first_name : "DummyUser", profileImg : 'http://dummyimage.com/300/09.png/fff'};

        $('#login-modal').closeModal();
        Materialize.toast('Welcome back, ' + $rootScope.currentUser.first_name, 2000, 'custom-toast')
    }

    //TODO: get currentUser from database by logging in.
    $scope.updateQuestionsFeed = function(feedType, startIndex, requestedQuestions, userID){
        $scope.doneUpdatingFeed = false;
        qs.getQuestions(feedType, startIndex, requestedQuestions, userID).then(
            function (returnedData) {
                //console.log(returnedData);
                if(returnedData.data){
                    $scope.loading = false;
                    $scope.posts = $scope.posts.concat(returnedData.data);
                    $scope.doneUpdatingFeed = true;
                }
            },
            function(err){
                // console.log("Error while updating the questions feed!");
            });
    }

    $scope.resetQuestionsFeed = function(){
        $scope.loading = true;
        // while($scope.posts.length > 0){
        //     $scope.posts.pop();
        // }
        $scope.posts = [];
    }

    $scope.getPost = function(questionID, userID){
        $scope.loading = true;
        //console.log(questionID, " ", userID);
        qs.getPost(questionID, userID)
        .then(function(res){
            //console.log(res);
            if(res.data){
                $scope.post = res.data.question;
                $scope.post.answers = res.data.answers;
                if($scope.post.answers){
                    $scope.numAnswers = $scope.post.answers.length;
                }
                $scope.loading = false;
                // console.log(res);
            }
            else{
                //     //TODO: remember to set $scope.loading = false when switching to 404 page.
                //     console.log("NO POST IN DB, SHOW 404 NOT FOUND ");
            }
        }, function(err){

        });
    }

    $scope.getQuestionsSummary = function(){
        qs.getQuestionsSummary().then(function(res){
            //XXX: had to manually access the root scope.
            $rootScope.questionsSummary = res.data;
            //TODO: set $scope.loading to be false only after both "posts" and the "questions summary" have been loaded!
        }, function(err){
            console.log("Error when getting questions summary.");
        });
    }

    $scope.notifications = qs.getNotifications();
    qs.submitGetTrendingTags().then(function(data) {
      $scope.trendingTags = data.data;
    });
}]);
