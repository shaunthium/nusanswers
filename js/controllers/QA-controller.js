/*Controls display of the "question-answers" page*/
angular.module('quoraApp')
.controller('QACtrl', ['$location', '$scope', '$stateParams', '$http', 'questionService', function($location, $scope, $stateParams, $http, qs){
  // console.log("hey id ", $stateParams.questionId);

  if($scope.currentUser){
      $scope.userID = $scope.currentUser.id;
  }
  else {
      $scope.userID = undefined;
  }

  $scope.getPost($stateParams.questionId, $scope.userID);
}]);
