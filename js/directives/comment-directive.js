'use strict'
angular.module('quoraApp')

.directive('comment', function($window){
	return {
		restrict: 'E',
        scope: true,
        controller : ['$scope', 'questionService', function($scope, questionService){
            // console.log($scope.comment);
            $scope.$watch(function(){
                return $scope.currentUser;
            },
            function(currentUser){
                if(currentUser && $scope.comment){
                    $scope.belongsToUser = $scope.comment.author.userid === currentUser.id;
                }
            });

            $scope.toggleLike = function(){
                if(!$scope.currentUser){
                    $scope.showLogin();
                    return;
                }
                if($scope.comment.liked){
                    if($scope.type === 'answer'){

                    }
                    else{
                        questionService.submitCancelUpvoteComment($scope.comment.id, $scope.currentUser.id)
                        .then(
                            function(res){
                                // console.log("Cancel upvote ", res);
                                if(res.data){
                                    $scope.comment.liked = false;
                                    $scope.comment.upvotes--;
                                }
                            },
                            function(err){

                            }
                        );
                    }
                }
                else{
                    if($scope.type === 'answer'){

                    }
                    else{
                        // console.log("upvote comment!", $scope.comment.id, " ", $scope.currentUser.id);
                        questionService.submitUpvoteComment($scope.comment.id, $scope.currentUser.id)
                        .then(
                            function(res){
                                // console.log(res);
                                if(res.data){
                                    $scope.comment.liked = true;
                                    $scope.comment.upvotes++;
                                }
                            },
                            function(err){

                            }
                        );
                    }
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
        }],
		link: function(scope, element, attrs){

		},
		templateUrl : "templates/comment-template.html"
	}
});
