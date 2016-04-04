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
                                if($scope.transcluded){
                                    console.log($scope.transcluded);
                                    $scope.lessText = $scope.transcluded.text().substring(0, $scope.maxLength);
                                    $scope.moreText = $scope.transcluded.text();
                                    $scope.readMore = false || $scope.readMore; //If it was arleady true, do not collapse it again.
                                    $scope.overflow = $scope.moreText ? true : false;
                                }
                            }
                        );
        },
        link: function(scope, element, attrs, ctrl, transclude){
            scope.maxLength = attrs.maxLength;
            transclude(scope.$parent, function(transcluded){
                scope.transcluded = transcluded;
            });
        },
        templateUrl: "templates/collapse-text-template.html"
    }
});
