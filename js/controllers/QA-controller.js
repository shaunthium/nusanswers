/*Controls display of the "question-answers" page*/
angular.module('quoraApp')
.controller('QACtrl', [ '$scope', '$stateParams', '$http', function($scope, $stateParams, $http){

  $scope.post = $stateParams.currPost;
  $scope.$watchCollection(function(){
      return $scope.answers;
  },
  function(answers){
      // $scope.filteredPosts = filterByTags(newPosts, $scope.activeTags);
      $scope.answers = answers;
      console.log('hey');
  });
  $http({
    url: "/server/answers.php",
    method: "POST",
    data: {
      cmd: "getanswers",
      question_id: $scope.post.id
    }
  }).then(function(data) {
    // $scope.answers = data.answers;
    // TODO: Hardcoded, need server fix
    // $scope.answers =[
    //   {"id":"8","user_id":"4294967295","content":"ggg","score":"0","created_at":"2016-04-07 01:50:34","updated_at":"2016-04-07 01:50:34","chosen":"0","author":" ","author_score":"0","comments":[]},
    //   {"id":"9","user_id":"4294967295","content":"gggg","score":"0","created_at":"2016-04-07 16:45:16","updated_at":"2016-04-07 16:45:16","chosen":null,"author":" ","author_score":"0","comments":[]},
    //   {"id":"10","user_id":"4294967295","content":"aghlgsd","score":"0","created_at":"2016-04-07 18:52:32","updated_at":"2016-04-07 18:52:32","chosen":null,"author":" ","author_score":"0","comments":[]}
    // ];
    $scope.answers = data.data.answers;
  });
}]);
