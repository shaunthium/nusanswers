/* Controls main view */
angular.module('quoraApp')
.controller('MainCtrl', [ '$scope', 'postService', '$rootScope', function($scope, ps, $rootScope){

  $rootScope.posts = ps.getPosts();

  /*Adds a new post to our dummy data*/
	/*$scope.addPost = function(){

		if(!$scope.title || $scope.title === '')
			return;

	  $scope.posts.push({
		  title: $scope.title,
		  author: 'Hello';
		  link: $scope.link,
		  upvotes: 0,
		  comments: [
		    {author: 'Joe', body: 'Cool post!', upvotes: 0},
		    {author: 'Bob', body: 'Great!', upvotes: 0}
		  ]
		});

	  $scope.title = '';
	  $scope.link = '';

	};*/

	$scope.incrementUpvotes = function(post, inc) {

	  post.upvotes += inc;

	};

}]);