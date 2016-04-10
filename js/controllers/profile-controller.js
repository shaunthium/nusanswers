angular.module('quoraApp')
.controller('ProfileCtrl', [ '$scope', '$http', function($scope, $http){
  // For temporary use only while fb integration is not complete
  // $scope.userName = 'CS3226';
  // $scope.profileImg = "http://dummyimage.com/300/09.png/fff";

  FB.getLoginStatus(function(resp) {
    if (resp.status == 'connected') {
      FB.api('/me', function(response) {
        // User's Facebook name
        $scope.userName = response.name;
        // Get user's profile picture
        $http({
          url: 'http://graph.facebook.com/v2.5/' + response.id + '/picture?redirect=false',
          method: 'GET',
          data: {
            width: '1000'
          }
        }).success(function(data) {
          $scope.profileImg = data.data.url;
        });

        $http({
          url: '/server/users/main.php',
          method: 'POST',
          data: {
            cmd: 'show',
            user_id: loggedInUserID
          }
        }).then(function(data) {
          console.log('user data is:');
          console.log(data);
          $scope.userScore = data.data.score;
        });
      });

      $http({
        url: '/server/answers.php',
        method: 'POST',
        data: {
          cmd: 'profileanswers',
          user_id: loggedInUserID
        }
      }).then(function(data){
        console.log('data is:');
        console.log(data);
        $scope.profileAnswers = data.data;
      });

      $http({
        url: '/server/questions.php',
        method: 'POST',
        data: {
          cmd: 'get_all_qns_of_user',
          user_id: loggedInUserID
        }
      }).then(function(data) {
        console.log(data);
        $scope.profileQns = data.data;
      });

      // $scope.$apply();
    }
  });

}]);
