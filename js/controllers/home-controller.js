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
.controller('HomeCtrl', [ '$scope', '$rootScope', '$stateParams', 'byTagsFilter', 'questionService', function($scope, $rootScope, $stateParams, filterByTags, questionService){
    $scope.feedIndex = 0;
    $scope.questionsPerUpdate = 10;
    $scope.activeTags = [];
    // $scope.updateQuestionsFeed($scope.feedType, ); //Use this to load all questions at a time. No infinite scroll feed.

    //Watch for changes in posts
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

    //Watch for changes in login status
    $scope.$watch(function(){
        return $scope.currentUser;
    },
    function(currentUser){
        $scope.feedIndex = 0;
        $scope.resetQuestionsFeed();
        if(currentUser){
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
    questionService.getQuestionsSummary().then(function(res){
        //XXX: had to manually access the root scope.
        $rootScope.questionsSummary = res.data;
        //TODO: set $scope.loading to be false only after both "posts" and the "questions summary" have been loaded!
    }, function(err){
        console.log("Error when getting questions summary.");
    });

    $(window).scroll(function(){
        //FIXME: arbitrarily defined update height
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
