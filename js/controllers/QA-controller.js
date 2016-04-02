/*Controls the details of the posts */

angular.module('quoraApp')
.controller('QACtrl', [ '$scope', '$stateParams', '$rootScope', function($scope, $stateParams, $rootScope){
	
	$scope.question = $stateParams.currQuestion;
	console.log("q", $scope.question)
	$scope.isAddCommentActive = false;
	$scope.COMMENTS_MIN_SIZE = 15;
	$scope.COMMENTS_MAX_SIZE = 30;
	
	$scope.toggleAddCommentVisible = function(){

		$scope.isAddCommentActive = !$scope.isAddCommentActive;

	}

	$scope.submitComment = function(){

		console.log("user comment", $scope.user_comment);

		if($scope.user_comment.length > $scope.COMMENTS_MAX_SIZE ||
			$scope.user_comment.length < $scope.COMMENTS_MIN_SIZE){
			alert("Comment not valid"); // Make this feedback cooler later
			return;
		}

		$scope.questions.comments.push({author:'Dummy', body:$scope.user_comment, upvotes:0})
		$scope.user_comment = "";
		$scope.isAddCommentActive = !$scope.isAddCommentActive;

	}

	$scope.toggleLikeComment = function(comment){

		comment.liked = !comment.liked;
	
	}

	$scope.toggleReportComment = function(comment){

		comment.reported = !comment.reported;

	}



}])