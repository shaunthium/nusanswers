/*Controls display of the "question-answers" page*/
angular.module('quoraApp')
.controller('QACtrl', [ '$scope', '$stateParams', '$rootScope', function($scope, $stateParams, $rootScope){

	$scope.post = $stateParams.currQuestion;

    if($scope.post.answers){
        $scope.numAnswers = $scope.post.answers.length;
    }
    else{
        $scope.numAnswers = 0;
    }
}]);
