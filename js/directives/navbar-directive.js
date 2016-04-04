'use strict'
angular.module('quoraApp')

.directive('navbar', function($window){
    return {
		restrict: 'E',
		transclude: false,
        controller: "NavCtrl",
        templateUrl : "templates/navbar-template.html"
        }
    });
