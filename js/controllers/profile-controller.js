angular.module('quoraApp')
.controller('ProfileCtrl', ['$stateParams','ezfb', '$scope', '$http', '$state', function($stateParams, ezfb, $scope, $http, $state){
  // var base_url = "http://139.59.247.83/";
  var base_url = '';
  var id = $stateParams.profileId;
  $scope.$watchCollection(function(){
    return $scope.user;
  }, function(user) {
    $scope.user = user;
  });
  var user = $http({
    url: base_url + 'server/users/main.php',
    method: 'POST',
    data: {
      cmd: 'show',
      user_id: id
    }
  }).then(function(data) {
    // console.log('data', data);
    $scope.user = data.data;
  })

  $scope.$watchCollection(function(){
    return $scope.profileImg;
  }, function(img) {
    $scope.profileImg = img;
  });
  $http({
    url: 'http://graph.facebook.com/v2.5/' + id + '/picture?redirect=false&width=9999',
    method: 'GET',
    data: {
      width: '1000'
    }
  }).success(function(data) {
    $scope.profileImg = data.data.url;
  });

  $scope.logout = function(){
    ezfb.logout(function(res) {
      // console.log(res);
    });
    $state.go('home');
  }

}])
