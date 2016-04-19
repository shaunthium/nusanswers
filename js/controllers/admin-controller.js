angular.module('quoraApp')
.controller('AdminCtrl', ['$stateParams','ezfb', '$scope', '$rootScope', '$http', '$state', 'questionService', '$timeout', function($stateParams, ezfb, $scope, $rootScope, $http, $state, qs, $timeout){

    $scope.showAdminLogin = true;
    $rootScope.loading = false;
    $rootScope.currentUser = {};
    $scope.hasLoadedAdminPosts = false;

    $scope.loginAdmin = function(){

        var admin_name = document.getElementById("admin_name").value;
        var admin_pw = document.getElementById("admin_pw").value;

        qs.loginAdmin(admin_name, admin_pw)
        .success(
            function(res){
                console.log("successfulle logged in", res);
                $scope.showAdminLogin = false;
                $rootScope.currentUser.isAdmin = true;
            },
            function(err){

            }
        )
        .catch(
            function(res){
                alert("Wrong credentials!");
                 console.log("res", res);
             }
         ).then(function(){

            qs.getQuestions("latest").then(
            function (returnedData) {
                 console.log("ret data", returnedData);
                if(returnedData.data){

                    returnedData.data.forEach(function(newPost){
                        for(var i = 0; i < $scope.posts.length; i++){
                            //Do not add repeated posts!
                            if($scope.posts[i].id === newPost.id){
                                // console.log("found repeated post! ", newPost.id);
                                return;
                            }
                        }
                        $scope.posts.push(newPost);
                    });
                    // $scope.posts = $scope.posts.concat(returnedData.data);

                    console.log("done");
                    $scope.doneUpdatingFeed = true;
                    $scope.hasLoadedAdminPosts = true;
                }
            },
            function(err){
                console.log("Error while updating the questions feed!");
            });


         });




        document.getElementById("admin_name").value = "";
        document.getElementById("admin_pw").value = "";

    }

}])
