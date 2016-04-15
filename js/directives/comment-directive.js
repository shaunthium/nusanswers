'use strict'
angular.module('quoraApp')

.directive('comment', function($window){
	return {
		restrict: 'E',
        scope: true,
        controller : function($scope){
            //TODO: implement current user verifications
            $scope.belongsToUser = $scope.comment.author.userid === $scope.currentUser.userID;
            console.log("belongs to user ", $scope.belongsToUser);

            $scope.toggleLike = function(){

                if(!$scope.currentUser){
                    $scope.showLogin();
                    return;
                }

                $scope.comment.liked = !$scope.comment.liked;
                if($scope.comment.liked == true){
                    $scope.comment.upvotes++;
                    $scope.upvoteComment($scope.comment.id);
                }
                else{
                    $scope.comment.upvotes--;
                    $scope.cancelUpvoteComment($scope.comment.id);
                }
            }

            $scope.toggleReport = function(){

                if(!$scope.currentUser){
                    $scope.showLogin();
                    return;
                }

                $scope.comment.reported = !$scope.comment.reported;
                if($scope.comment.reported){
                    $scope.reportComment($scope.comment.id);
                }
                else{
                    $scope.cancelReportComment($scope.comment.id);
                }
            }
        },
		link: function(scope, element, attrs){

		},
		templateUrl : "templates/comment-template.html"
	}
});
