'use strict'
angular.module('quoraApp')

.directive('comment', function($window){
	return {
		restrict: 'E',
        scope: true,
        controller : function($scope){
            //TODO: implement current user verifications
            $scope.belongsToUser = $scope.comment.author.userid === $scope.currentUser.userid;
            console.log($scope.comment.author.userid);

            $scope.toggleLike = function(){
                $scope.comment.liked = !$scope.comment.liked;
                if($scope.comment.liked == true){
                    $scope.comment.upvotes++;
                }
                else{
                    $scope.comment.upvotes--;
                }
            }

            $scope.toggleReport = function(){
                $scope.comment.reported = !$scope.comment.reported;
            }
        },
		link: function(scope, element, attrs){

		},
		templateUrl : "templates/comment-template.html"
	}
});
