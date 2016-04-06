angular.module('quoraApp')
.controller('ProfileCtrl', [ '$scope', '$http', function($scope, $http){
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
}])
