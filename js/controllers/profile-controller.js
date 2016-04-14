angular.module('quoraApp')
.controller('ProfileCtrl', ['ezfb', '$scope', '$http', '$state', function(ezfb, $scope, $http, $state){
  // For temporary use only while fb integration is not complete

  //$scope.userName = 'CS3226';
  //$scope.profileImg = "http://dummyimage.com/300/09.png/fff";

  // FB.getLoginStatus(function(resp) {
  //   if (resp.status == 'connected') {
  //     FB.api('/me', function(response) {
  //       // User's Facebook name
  //       $scope.userName = response.name;
  //       // Get user's profile picture
  //       $http({
  //         url: 'http://graph.facebook.com/v2.5/' + response.id + '/picture?redirect=false',
  //         method: 'GET',
  //         data: {
  //           width: '1000'
  //         }
  //       }).success(function(data) {
  //         $scope.profileImg = data.data.url;
  //       });
  //
  //       $scope.$apply();
  //     });
  //   }
  // });

  $scope.logout = function(){
    // $scope.$parent.currentUser = undefined;
    ezfb.logout(function(res) {
      // console.log(res);
    });
    $state.go('home');
  }

}])
