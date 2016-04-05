'use strict';

angular.module('quoraApp')
.service('questionService', ['$q', '$http', function($q, $http){

    var questions_url = "/server/questions.php";
    var questions;
    var canceller;

    //FIXME: Remove hardcoded data and replace with proper server integration
    /*BEGIN HARDCODED SERVER REPLY OBJECTS */
    var id = 0;
    var answer =  {
                    id: 600,
                    author:     {name:'Alex', karma:100, userid:99, flavor: "Newbie"},
                    desc:       "I am an answer.",
                    upvotes:    0,
                    comments:   [{author: {name:'Eric', karma:120, userid: 5, flavor: "Newbie"}, body:'Some comment content2222 ome comment content2233322', upvotes:1, liked : false, reported : false, id:id++}]
                };

    var newPost =  {
                    id: 600,
                    title: "New Post",
                    tags:   ["New post!", "Tags", "MoreTags", "EvenMoreTags"],
                    author:     {name:'Alex', karma:100, userid:99, flavor: "Newbie"},
                    views:      9001,
                    desc:       "This is a new question description placeholder.",
                    upvotes:    0,
                    comments:   [{author: {name:'Eric', karma:120, userid: 5, flavor: "Newbie"}, body:'Some comment content2222 ome comment content2233322', upvotes:1, liked : false, reported : false, id:id++}],
                    answers: [JSON.parse(JSON.stringify(answer)), JSON.parse(JSON.stringify(answer)), JSON.parse(JSON.stringify(answer)), JSON.parse(JSON.stringify(answer))]
                };

	// Just hardcoded atm
	var posts = [{
 				  id:0,
 				  title: 'When does Indian open on Sundays?',
 				  tags: ['Latest', "Tags", "MoreTags", "EvenMoreTags"],
 				  author:{name:'User1', karma:100, userid:2, flavor: "Newbie"},
 				  views: 10,
 				  desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam vel scelerisque quam. Pellentesque ut mattis tellus. Donec maximus elementum nibh eget gravida. In sed leo a lectus suscipit porta. Fusce ornare sem vel sem viverra tempor. Aenean et tempus sapien. Donec sit amet mollis nibh. Suspendisse interdum, ipsum a maximus mattis, ipsum nibh viverra ipsum, eget facilisis enim mauris vitae urna. Mauris vulputate libero sed dapibus tristique. Nullam at ante a nisi porttitor rhoncus.',
 					upvotes:0,
 					comments: [
 				 		{author:{name:'Bob', karma:100, userid:3, flavor: "Newbie"}, body:'Some comment content', upvotes:0, liked : false, reported : false, id:id++},
 				 		{author:{name:'Eric', karma:200, userid:4, flavor: "Newbie"}, body:'Some comment content2222 ome comment content2233322', upvotes:1, liked : false, reported : false, id:id++}
 				 	],
                    answers : [JSON.parse(JSON.stringify(answer)), JSON.parse(JSON.stringify(answer)), JSON.parse(JSON.stringify(answer)), JSON.parse(JSON.stringify(answer))]
                },
 				 {
 				  id:1,
 				  title: 'Why is nobody asking questions during lecture?',
 				  tags: ['Lectures', "Latest", "Tags"],
 				  author: {name:'User2', karma:150, userid:5, flavor: "Newbie"},
 				  views: 25,
 				  desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.In sed leo a lectus suscipit porta. Suspendisse interdum, ipsum a maximus mattis, ipsum nibh viverra ipsum, eget facilisis enim mauris vitae urna. Mauris vulputate libero sed dapibus tristique. Nullam at ante a nisi porttitor rhoncus.',
 					upvotes:0,
 					comments: [
 				 		{author:{name:'Bob', karma:100, userid:3, flavor: "Newbie"}, body:'Some comment content', upvotes:0, liked : false, reported : false, id:id++},
 				 		{author:{name:'Eric', karma:200, userid:4, flavor: "Newbie"}, body:'Some comment content2222 ome comment content2222222333', upvotes:0, liked : false, reported : false, id:id++}
 				 	],
                    answers: [JSON.parse(JSON.stringify(answer))]
 				},
 				{
 				  id:2,
 				  title: 'When does starbucks close on public holidays?',
 				  tags: ['UTown', "Tags"],
 				  author: {name:'Steven', karma:7, userid:7, flavor: "Newbie"},
 				  views: 25,
 				  desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam vel scelerisque quam. Pellentesque ut mattis tellus.  Aliquam vel scelerisque quam. Pellentesque ut mattis tellus.',
 					upvotes:0,
 					comments: [
 				 		{author:{name:'Bob', karma:100, userid:3, flavor: "Newbie"}, body:'Some comment content', upvotes:0, liked : false, reported : false, id:id++},
 				 		{author:{name:'Eric', karma:200, userid:4, flavor: "Newbie"}, body:'Some comment content2222', upvotes:0, liked : false, reported : false, id:id++}
 				 	],
                    answers : []
 				}];


    var notifications = ["Notification 1","Notification 2","Notification 3","Notification 4"];
    /*END HARDCODED SERVER REPLY OBJECTS*/

    function getQuestions() {
        //   $http({
        //     method: 'POST',
        //     url: questions_url,
        //     data: {
        //       cmd: "trending",
        //     },
        //     dataType: 'json'
        //   }).then(function success(returnedData) {
        //     questions = returnedData.data;
        //     console.log(questions);
        //   });
          //
        //   return questions;
        return posts;
    }

    //TODO: implement back-end communication
    function getNotifications(){
        var serverReply = JSON.parse(JSON.stringify(notifications));
        return serverReply;
    }

    function cancelCall(){

        canceller.resolve("User cancelled call");

    }

    //TODO: implement back-end integration
    /*FIXME: should we sanitize input before sending it to the server?*/
    //TODO: check for duplicate questions before storing a new question
    function submitNewPost(title, user){
        var serverReply = JSON.parse(JSON.stringify(newPost));
        serverReply.title = title;
        serverReply.author = user;
        return serverReply;
    }

    //TODO: implement back-end integration
    /*FIXME: should we sanitize input before sending it to the server?*/
    function submitNewComment(postID, commentBody, user){
        //This function should add the comment to the post server-side and return a comment object, which will be attached to the post client-side.
        //TODO: discuss the best way to add/delete comments and answers from posts
        return {author: user, body: commentBody, upvotes: 0, liked: false, reported: false, id:id++};
    }

    //TODO: implement back-end integration
    function submitDeleteComment(postID, commentID){
        return true;
    }

    //TODO: implement back-end integration
    function submitReportComment(postID, commentID, user){
        return false;
    }

    //TODO: implement back-end integration
    function submitCancelReportComment(postID, commentID, user){
        return false;
    }

    //TODO: implement back-end integration
    function submitReportPost(postID, commentID, user){
        return false;
    }

    //TODO: implement back-end integration
    function submitCancelReportPost(postID, commentID, user){
        return false;
    }

    //TODO: implement back-end integration
    function submitUpvotePost(postID, commentID, user){
        return false;
    }

    //TODO: implement back-end integration
    function submitCancelUpvotePost(postID, commentID, user){
        return false;
    }

    //TODO: implement back-end integration
    function submitDownvotePost(postID, commentID, user){
        return false;
    }

    //TODO: implement back-end integration
    function submitCancelDownvotePost(postID, commentID, user){
        return false;
    }

    //TODO: implement back-end integration
    function submitUpvoteComment(postID, commentID, user){
        console.log("Upvote!");
        return false;
    }

    //TODO: implement back-end integration
    function submitCancelUpvoteComment(postID, commentID, user){
        return false;
    }

    //TODO: implement back-end integration
    function submitCancelDownvoteComment(postID, commentID, user){
        return false;
    }

    //TODO: implement back-end integration
    function submitGetTrendingTags(){
        return ['These', 'are', 'sample', 'tags', 'Lectures', 'Latest', 'UTown'];
    }

    return {
        getQuestions                :   getQuestions,
        cancelCall                  :   cancelCall,
        submitNewPost               :   submitNewPost,
        submitNewComment            :   submitNewComment,
        submitDeleteComment         :   submitDeleteComment,
        submitReportComment         :   submitReportComment,
        submitCancelReportComment   :   submitCancelReportComment,
        submitReportPost            :   submitReportPost,
        submitCancelReportPost      :   submitCancelReportPost,
        submitUpvotePost            :   submitUpvotePost,
        submitCancelUpvotePost      :   submitCancelUpvotePost,
        submitDownvotePost          :   submitDownvotePost,
        submitCancelDownvotePost    :   submitCancelDownvotePost,
        submitUpvoteComment         :   submitUpvoteComment,
        submitCancelUpvoteComment   :   submitCancelUpvoteComment,
        submitCancelDownvoteComment :   submitCancelDownvoteComment,
        submitGetTrendingTags       : submitGetTrendingTags,
        getNotifications            :   getNotifications
    }

}]);
