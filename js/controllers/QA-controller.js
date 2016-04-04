/*Controls display of the "question-answers" page*/
angular.module('quoraApp')
.controller('QACtrl', [ '$scope', '$stateParams', function($scope, $stateParams){

	$scope.post = $stateParams.currPost;

    if($scope.post.answers){
        $scope.numAnswers = $scope.post.answers.length;
    }
    else{
        $scope.numAnswers = 0;
    }
}]);
