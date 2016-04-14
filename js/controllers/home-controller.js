/* Controls home view */
/*
TODO:
+ Can display fancy notifications.
+ Live-update of the latest tags or trends.
+ More information is displayed in the home view.

*/
angular.module('quoraApp')
.filter('byTags', function(){
    return function (posts, tags){
        //XXX: potential security flaw? Passing an array of something that is not strings. Not passing an array?
        if(!tags || typeof tags === 'undefined' || tags.length === 0){
            return posts;
        }
        return posts.filter(function(post){
            var relevant = false;
            if(!(!post.tags || typeof post.tags === 'undefined' || post.tags.length === 0))
            post.tags.forEach(function(postTag){
                tags.forEach(function(arrayTag){
                    relevant = relevant || postTag.toUpperCase() === arrayTag.toUpperCase();
                });
            }
        );
        return relevant;
    });
};
})
.controller('HomeCtrl', [ '$scope', '$stateParams', 'byTagsFilter', function($scope, $stateParams, filterByTags){
    $scope.activeTags = [];

    //Watch for changes in activeTags, coming from the trending-box
    $scope.$watchCollection(function(){
        return $scope.posts;
    },
    function(newPosts){
        $scope.filteredPosts = filterByTags(newPosts, $scope.tags);
    });

    //Watch for changes in activeTags, coming from the trending-box
    $scope.$watchCollection(function(){
        return $scope.activeTags;
    },
    function(newTags){
        $scope.filteredPosts = filterByTags($scope.posts, newTags);
    });

    console.log("in home controller")

    $scope.showTextEditor = false;
    $scope.toggleTextEditor = function(){
        $('#wysiwyg-editor').trumbowyg({
            fullscreenable: false,
            btns:['bold', 'italic', 'insertImage', 'link']
        });
        $scope.showTextEditor = !$scope.showTextEditor;
    }

}]);
