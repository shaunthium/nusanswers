/*Controls display of the "question-answers" page*/
angular.module('quoraApp')
.controller('QACtrl', ['$location', '$scope', '$stateParams', '$http', 'questionService', function($location, $scope, $stateParams, $http, qs){
  // console.log("hey id ", $stateParams.questionId);

  $scope.$watchCollection(function(){
      return $scope.currentUser;
  },
    function(currentUser){
        if(currentUser){
            console.log(currentUser.id);
            $scope.getPost($stateParams.questionId, currentUser.id);
        }
        else{
            console.log(currentUser);
            $scope.getPost($stateParams.questionId);
        }
    })

}]);
