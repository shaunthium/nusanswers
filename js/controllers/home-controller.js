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
            if(!(!post.tags || typeof post.tags === 'undefined' || post.tags.length === 0)){
                    post.tags.forEach(function(postTag){
                        tags.forEach(function(arrayTag){
                            relevant = relevant || postTag.toUpperCase() === arrayTag.toUpperCase();
                        });
                    });
            }
            return relevant;
        });
    };
})
.controller('HomeCtrl', [ '$scope', '$rootScope', '$stateParams', 'byTagsFilter', 'questionService', '$state', function($scope, $rootScope, $stateParams, filterByTags, questionService, $state){
    
    if($rootScope.currentUser && $rootScope.currentUser.isAdmin)
        $state.go('admin');

    $scope.feedIndex = 0;
    $scope.questionsPerUpdate = 10;
    $scope.activeTags = [];
    // $scope.updateQuestionsFeed($scope.feedType, ); //Use this to load all questions at a time. No infinite scroll feed.

    //Watch for changes in posts
    $scope.$watchCollection(function(){
        return $scope.posts;
    },
    function(newPosts){
        $scope.filteredPosts = filterByTags(newPosts, $scope.activeTags);
    });

    //Watch for changes in activeTags, coming from the trending-box
    $scope.$watchCollection(function(){
        return $scope.activeTags;
    },
    function(newTags){
        $scope.filteredPosts = filterByTags($scope.posts, newTags);
    });

    //Watch for changes in login status
    $scope.$watch(function(){
        return $scope.currentUser;
    },
    function(currentUser){
        $scope.feedIndex = 0;
        $scope.resetQuestionsFeed();
        if(currentUser){
            $scope.userID = currentUser.id;
            $scope.updateQuestionsFeed($scope.feedType, ($scope.feedIndex++)*$scope.questionsPerUpdate, $scope.questionsPerUpdate, currentUser.id); //Infinite scroll feed
        }
        else{
            $scope.updateQuestionsFeed($scope.feedType, ($scope.feedIndex++)*$scope.questionsPerUpdate, $scope.questionsPerUpdate); //Infinite scroll feed
        }
    });

    //Watch for changes in feed type requests
    $scope.$watch(function(){
        return $scope.feedType;
    },
    function(feedType){
        $scope.feedIndex = 0;
        $scope.resetQuestionsFeed();
        if($scope.currentUser){
            $scope.updateQuestionsFeed(feedType, ($scope.feedIndex++)*$scope.questionsPerUpdate, $scope.questionsPerUpdate, $scope.currentUser.id); //Infinite scroll feed
        }
        else{
            $scope.updateQuestionsFeed(feedType, ($scope.feedIndex++)*$scope.questionsPerUpdate, $scope.questionsPerUpdate); //Infinite scroll feed
        }
    });


    //FIXME: currently, search parameters are only updated when the user goes to the home view.
    //UPDATE: Search parameters are now also updated when the user lands in the QA view.
    $scope.getQuestionsSummary();

    $(window).scroll(function(){
        //FIXME: arbitrarily defined update height
        //FIXME: cannot scroll when there are no posts in view. How to get new posts while filtering by tags?
        //FIXME: BUG IDENTIFIED: window height and document scrollTop are not always properly calculated. Especially as the number of posts increases.
        if(($(window).scrollTop() >= 0.7*$(document).height() || $(window).scrollTop() + 2000 >= 0.9*$(document).height()) && $scope.doneUpdatingFeed) {
            console.log("Update feed!");
            $scope.updateQuestionsFeed($scope.feedType, ($scope.feedIndex++)*$scope.questionsPerUpdate, $scope.questionsPerUpdate, $scope.userID);
        }
    });

    $scope.showTextEditor = false;
    $scope.toggleTextEditor = function(){
        $('#wysiwyg-editor').trumbowyg({
            fullscreenable: false,
            btns:['bold', 'italic', 'insertImage', 'link']
        });
        $scope.showTextEditor = !$scope.showTextEditor;
    }
}]);
