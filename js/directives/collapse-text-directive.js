'use strict'
angular.module('quoraApp')

.directive('collapseText', function($window){
    return{
        restrict: 'E',
        scope: true,
        transclude: true,
        controller : function($scope){
            $scope.readMore = false;
            $scope.toggleReadMore = function(){
                $scope.readMore = true;
            }

            $scope.$watch(
                function(){
                    return $scope.transcluded;
                },
                function(newValue){
                    if(newValue){
                        $scope.lessText = newValue.text().substring(0, $scope.maxLength);
                        $scope.moreText = newValue.text();
                        $scope.readMore = false || $scope.readMore; //If it was arleady true, do not collapse it again.
                        $scope.overflow = $scope.moreText.length > $scope.lessText.length ? true : false;
                    }
                }
            );
        },
        link: function(scope, element, attrs, ctrl, transclude){
            scope.maxLength = attrs.maxLength;
            scope.readMore = false;
            scope.overflow = false;
            transclude(scope.$parent, function(transcluded){
                scope.transcluded = transcluded;
            });
        },
        templateUrl: "templates/collapse-text-template.html"
    }
});
