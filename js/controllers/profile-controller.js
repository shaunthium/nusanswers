angular.module('quoraApp')
.controller('ProfileCtrl', ['$stateParams','ezfb', '$scope', '$rootScope', '$http', '$state', function($stateParams, ezfb, $scope, $rootScope, $http, $state){
  // var base_url = "http://139.59.247.83/";
  var base_url = '';

  // Pull user's id from state params
  var id = $stateParams.profileId;

  // Get user from id
  var user = $http({
    url: base_url + 'server/users/main.php',
    method: 'POST',
    data: {
      cmd: 'show',
      user_id: id
    }
  }).then(function(data) {
    $scope.user = data.data;
  })

  // Get profile img
  $http({
    url: 'http://graph.facebook.com/v2.5/' + id + '/picture?redirect=false&width=9999',
    method: 'GET',
    data: {
      width: '1000'
    }
  }).success(function(data) {
    $scope.profileImg = data.data.url;
  });

  // Get answers for user
  $http({
    url: base_url + 'server/answers.php',
    method: 'POST',
    data: {
      cmd: 'profileanswers',
      user_id: id
    }
  }).then(function(data) {
    $scope.profileAnswers = data.data;
  })

  // Get questions for user
  $http({
    url: base_url + 'server/questions.php',
    data: {
      cmd: 'get_all_qns_of_user',
      user_id: id
    },
    method: 'POST'
  }).then(function(data) {
    $scope.profileQuestions = data.data;
  })

  $scope.logout = function(){
    ezfb.logout(function(res) {
      // console.log(res);
    });
    $rootScope.currentUser = undefined;
    Materialize.toast('Successfully logged out', 2000, 'custom-toast')
    $state.go('home');
  }

}])
