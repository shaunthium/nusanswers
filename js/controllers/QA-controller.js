/*Controls display of the "question-answers" page*/
angular.module('quoraApp')
.controller('QACtrl', ['$location', '$scope', '$stateParams', '$http', 'questionService', function($location, $scope, $stateParams, $http, qs){

  // $scope.post = $stateParams.currPost;
  var id = $location.search().id;
  console.log('id', id);
  qs.getPost(id).then(function(data) {
    console.log('data is', data);
    $scope.post = data.data[0];
    qs.getAnswersToCurrentPost(id)
      .then(function(data){

        $scope.post.answers = data.data.answers;
        if($scope.post.answers.length > 0)
          $scope.numAnswers = $scope.post.answers.length;
        else
          $scope.numAnswers = 0;

      }, function(err){
        console.log("error in getting answers to questions", err);
      });
  });

}]);
