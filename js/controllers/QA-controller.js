/*Controls display of the "question-answers" page*/
angular.module('quoraApp')
.controller('QACtrl', ['$location', '$scope', '$stateParams', '$http', 'questionService', function($location, $scope, $stateParams, $http, qs){
  // console.log("hey id ", $stateParams.questionId);

  qs.getPost($stateParams.questionId)
    .then(function(res){

      // console.log("ok got post ", res.data[0]);
      $scope.post = res.data[0];
      if(!$scope.post){
        // console.log("NO POST IN DB, SHOW 404 NOT FOUND ");
      } else {
        qs.getAnswersToCurrentPost($scope.post.id)
        .then(function(res){

          $scope.post.answers = res.data.answers;
          if($scope.post.answers.length > 0)
            $scope.numAnswers = $scope.post.answers.length;
          else
            $scope.numAnswers = 0;

        }, function(err){

          // console.log("err in getting answers to post", err);

        });
      }
    }, function(err){

      // console.log("err in getting post with id " + $stateParams.questionId, err);

    });
}]);
