angular.module('quoraApp')
.controller('AdminCtrl', ['$stateParams','ezfb', '$scope', '$rootScope', '$http', '$state', 'questionService', '$timeout', function($stateParams, ezfb, $scope, $rootScope, $http, $state, qs, $timeout){

    $scope.feedIndex = 0;
    $scope.questionsPerUpdate = 15;
    $scope.showAdminLogin = true;
    $rootScope.loading = false;
    $scope.hasLoadedAdminPosts = false;
    var failedLogin = false;

    $scope.resetQuestionsFeed();

    //FIXME: currently, search parameters are only updated when the user goes to the home view.
    //UPDATE: Search parameters are now also updated when the user lands in the QA view.
    $scope.getQuestionsSummary();

    $(window).scroll(function(){
        //FIXME: arbitrarily defined update height
        //FIXME: cannot scroll when there are no posts in view. How to get new posts while filtering by tags?
        //FIXME: BUG IDENTIFIED: window height and document scrollTop are not always properly calculated. Especially as the number of posts increases.
        if(($(window).scrollTop() >= 0.7*$(document).height() || $(window).scrollTop() + 2000 >= 0.9*$(document).height()) && $scope.doneUpdatingFeed) {
            console.log("Update feed!");
            $scope.updateQuestionsFeed("latest", ($scope.feedIndex++)*$scope.questionsPerUpdate, $scope.questionsPerUpdate);
        }
    });

    $scope.loginAdmin = function(){

        var admin_name = document.getElementById("admin_name").value;
        var admin_pw = document.getElementById("admin_pw").value;

        qs.loginAdmin(admin_name, admin_pw)
        .success(
            function(res){
                console.log("successfulle logged in", res);
                //$scope.showAdminLogin = false;
                $rootScope.currentUser = {};
                $rootScope.currentUser.id = 1;
                $rootScope.currentUser.first_name = "Admin"
                $rootScope.currentUser.isAdmin = true;
            },
            function(err){

            }
        )
        .catch(
            function(res){
                alert("Wrong credentials!");
                failedLogin = true;
             }
         ).then(function(){

            if(!failedLogin){
                $scope.updateQuestionsFeed("latest", ($scope.feedIndex++)*$scope.questionsPerUpdate, $scope.questionsPerUpdate);
                //TODO: implement get all answers

                //FIXME: deprecated code. should be removed after newer version proves to be working.
                // qs.getQuestions("latest").then(
                // function (returnedData) {
                //     console.log("ret data", returnedData);
                //     if(returnedData.data){
                //
                //         returnedData.data.forEach(function(newPost){
                //             for(var i = 0; i < $scope.posts.length; i++){
                //                 //Do not add repeated posts!
                //                 if($scope.posts[i].id === newPost.id){
                //                     // console.log("found repeated post! ", newPost.id);
                //                     return;
                //                 }
                //             }
                //             $scope.posts.push(newPost);
                //         });
                //         // $scope.posts = $scope.posts.concat(returnedData.data);
                //
                //         console.log("done");
                //         $scope.doneUpdatingFeed = true;
                //         $scope.hasLoadedAdminPosts = true;
                //     }
                // },
                // function(err){
                //     console.log("Error while updating the questions feed!");
                // })
                // .then(function(){
                //
                //     // qs.getAllAnswers().then(function(res){
                //
                //     //     console.log("res answers", res);
                //
                //
                //     // }, function(err){
                //
                //     //     console.log("Err in getting answers", err);
                //
                //
                //     // })
                //
                // });

            }


         });
        document.getElementById("admin_name").value = "";
        document.getElementById("admin_pw").value = "";

    }

}])
