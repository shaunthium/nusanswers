/*Controls the details of the posts */

angular.module('quoraApp')
.controller('PostCtrl', [ '$scope', '$stateParams', '$rootScope', function($scope, $stateParams, $rootScope){
	
	$scope.post = $stateParams.currPost;

	/*$scope.post = posts.posts[$stateParams.id];

	$scope.addComment = function(){
	  if($scope.body === '')
	  	return;
	  $scope.post.comments.push({
	    body: $scope.body,
	    author: 'user',
	    upvotes: 0
	  });
	  $scope.body = '';
	};*/

}])