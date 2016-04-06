/*Controls display of the "question-answers" page*/
angular.module('quoraApp')
.controller('QACtrl', [ '$scope', '$stateParams', '$http', function($scope, $stateParams, $http){

  $scope.post = $stateParams.currPost;
  console.log('here');
  console.log($scope.post);
  $http({
    url: "/server/answers.php",
    method: "POST",
    data: {
      cmd: "getanswers",
      question_id: $scope.post.id
    }
  }).success(function(data) {
    console.log(data);
  });
  //
  //   if($scope.post.answers){
  //       $scope.numAnswers = $scope.post.answers.length;
  //   }
  //   else{
  //       $scope.numAnswers = 0;
  //   }
}]);
