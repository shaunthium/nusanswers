/*Controls display of the "question-answers" page*/
angular.module('quoraApp')
.controller('QACtrl', [ '$scope', '$stateParams', '$http', 'questionService', function($scope, $stateParams, $http, qs){

  $scope.post = $stateParams.currPost;

  qs.getAnswersToCurrentPost($scope.post.id)
    .then(function(data){

      $scope.post.answers = data.data.answers;
      if($scope.post.answers.length > 0)
        $scope.numAnswers = $scope.post.answers.length;
      else 
        $scope.numAnswers = 0;

    }, function(err){
      console.log("error in getting answers to questions", err);
    });
  
}]);
