/*Controls display of the "question-answers" page*/
angular.module('quoraApp')
.controller('QACtrl', ['$location', '$scope', '$stateParams', '$http', 'questionService', function($location, $scope, $stateParams, $http, qs){
  // console.log("hey id ", $stateParams.questionId);
  //Get the questions summary if it is not already defined
  if(!$scope.questionsSummary){
      $scope.getQuestionsSummary();
  }

  $scope.$watchCollection(function(){
      return $scope.currentUser;
  },
    function(currentUser){
        if(currentUser){
            $scope.getPost($stateParams.questionId, currentUser.id);
        }
        else{
            $scope.getPost($stateParams.questionId);
        }
    });

    qs.getAllTags()
    .then(
        function(res){
            if(res.data){
                $scope.allTags = res.data;
            }
        },
        function(err){
            // console.log("Error while retrieving tag list from the server.");
        }
    );
}]);
