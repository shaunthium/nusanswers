/*Controls display of the "question-answers" page*/
angular.module('quoraApp')
.controller('QACtrl', ['$location', '$scope', '$stateParams', '$http', function($location, $scope, $stateParams, $http){

  // $scope.post = $stateParams.currPost;
  $scope.$watchCollection(function() {
    return $scope.post;
  }, function(post){
    $scope.post = post;
  });

  $http({
    url: '/server/questions.php',
    method: 'POST',
    data: {
      cmd: 'get_qns_info',
      qns_id: $location.search().id
    }
  }).then(function(data){
    console.log('data is:');
    console.log(data);
    $scope.post = data.data[0];

      $scope.$watchCollection(function(){
          return $scope.answers;
      },
      function(answers){
          // $scope.filteredPosts = filterByTags(newPosts, $scope.activeTags);
          $scope.answers = answers;
          // console.log('hey');
      });
      $http({
        url: "/server/answers.php",
        method: "POST",
        data: {
          cmd: "getanswers",
          question_id: $scope.post.id
        }
      }).then(function(data) {
        $scope.answers = data.data.answers;
      });
  });
}]);
