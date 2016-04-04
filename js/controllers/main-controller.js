/*This is the uppermost controller.*/
angular.module('quoraApp')
.controller('MainCtrl', [ '$scope', 'questionService', '$rootScope', '$state', function($scope, qs, $rootScope, $state){
    $scope.currentUser = {name : "root", karma : 9999, userid : 0};

    $scope.posts = qs.getQuestions();
    $scope.notifications = qs.getNotifications();

    console.log("getting fresh posts from service..");

    $scope.goToPost = function(post){
        $state.go('qa', {'currPost' : post});
    }

    $scope.newPost = function(title){
        return qs.submitNewPost(title, $scope.currentUser);
    }

}]);
