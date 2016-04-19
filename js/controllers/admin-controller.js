angular.module('quoraApp')
.controller('AdminCtrl', ['$stateParams','ezfb', '$scope', '$rootScope', '$http', '$state', 'questionService', '$timeout', function($stateParams, ezfb, $scope, $rootScope, $http, $state, qs, $timeout){

    $scope.showAdminLogin = true;
    $rootScope.loading = false;


    $scope.loginAdmin = function(){

        var admin_name = document.getElementById("admin_name").value;
        var admin_pw = document.getElementById("admin_pw").value;

        qs.loginAdmin(admin_name, admin_pw)
        .success(
            function(res){
            $scope.showAdminLogin = false;
            $rootScope.currentUser.isAdmin = true;
            },
            function(err){

            }
        )
        .catch(
            function(res){
                 console.log("res", res);
             }
         );
        
        document.getElementById("admin_name").value = "";
        document.getElementById("admin_pw").value = "";

    }

}])
