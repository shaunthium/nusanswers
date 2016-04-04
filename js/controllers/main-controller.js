/* Controls main view */
angular.module('quoraApp')
.controller('MainCtrl', [ '$scope', 'questionService', '$rootScope', '$state', function($scope, qs, $rootScope, $state){
    $scope.showOverlay = true;
    $rootScope.questions = qs.getQuestions();
    console.log("getting fresh posts from service..");

    $scope.incrementUpvotes = function(post, inc) {
	  post.upvotes += inc;
	};
}]);
