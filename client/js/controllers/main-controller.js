/* Controls main view */
angular.module('quoraApp')
.controller('MainCtrl', [ '$scope', 'postService', '$rootScope', '$state', function($scope, ps, $rootScope, $state){

  $rootScope.posts = ps.getPosts();
  console.log("getting fresh posts from service..");
 
	$scope.incrementUpvotes = function(post, inc) {

	  post.upvotes += inc;

	};

}]);