/*Controls display of the "question-answers" page*/
angular.module('quoraApp')
.controller('QACtrl', ['$location', '$scope', '$stateParams', '$http', 'questionService', function($location, $scope, $stateParams, $http, qs){
  // console.log("hey id ", $stateParams.questionId);

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
    })

}]);
