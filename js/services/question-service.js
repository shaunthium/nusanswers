'use strict';

angular.module('quoraApp')
.service('questionService', ['$q', '$http', function($q, $http){

    var questions_url = "/server/questions.php";
    var questions;
    var canceller;

    //FIXME: Remove hardcoded data and replace with proper server integration
    /*BEGIN HARDCODED SERVER REPLY OBJECTS */
    var answer =  {
                    id: 600,
                    author:     {name:'Alex', karma:100, userid:99},
                    desc:       "I am an answer.",
                    upvotes:    0,
                    comments:   [{author: {name:'Eric', karma:120, userid: 5}, body:'Some comment content2222 ome comment content2233322', upvotes:1, liked : false, reported : false}]
                };

    var newPost =  {
                    id: 600,
                    title: "New Post",
                    category:   "New post!",
                    author:     {name:'Alex', karma:100, userid:99},
                    views:      9001,
                    desc:       "This is a new question description placeholder.",
                    upvotes:    0,
                    comments:   [{author: {name:'Eric', karma:120, userid: 5}, body:'Some comment content2222 ome comment content2233322', upvotes:1, liked : false, reported : false}],
                    answers: [JSON.parse(JSON.stringify(answer)), JSON.parse(JSON.stringify(answer)), JSON.parse(JSON.stringify(answer)), JSON.parse(JSON.stringify(answer))]
                };

	// Just hardcoded atm
	var posts = [{
 				  id:0,
 				  title: 'When does Indian open on Sundays?',
 				  category: 'Latest',
 				  author:{name:'User1', karma:100, userid:2},
 				  views: 10,
 				  desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam vel scelerisque quam. Pellentesque ut mattis tellus. Donec maximus elementum nibh eget gravida. In sed leo a lectus suscipit porta. Fusce ornare sem vel sem viverra tempor. Aenean et tempus sapien. Donec sit amet mollis nibh. Suspendisse interdum, ipsum a maximus mattis, ipsum nibh viverra ipsum, eget facilisis enim mauris vitae urna. Mauris vulputate libero sed dapibus tristique. Nullam at ante a nisi porttitor rhoncus.',
 					upvotes:0,
 					comments: [
 				 		{author:{name:'Bob', karma:100, userid:3}, body:'Some comment content', upvotes:0, liked : false, reported : false},
 				 		{author:{name:'Eric', karma:200, userid:4}, body:'Some comment content2222 ome comment content2233322', upvotes:1, liked : false, reported : false}
 				 	]},
 				 {
 				  id:1,
 				  title: 'Why is nobody asking questions during lecture?',
 				  category: 'Lectures',
 				  author: {name:'User2', karma:150, userid:5},
 				  views: 25,
 				  desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.In sed leo a lectus suscipit porta. Suspendisse interdum, ipsum a maximus mattis, ipsum nibh viverra ipsum, eget facilisis enim mauris vitae urna. Mauris vulputate libero sed dapibus tristique. Nullam at ante a nisi porttitor rhoncus.',
 					upvotes:0,
 					comments: [
 				 		{author:{name:'Bob', karma:100, userid:3}, body:'Some comment content', upvotes:0, liked : false, reported : false},
 				 		{author:{name:'Eric', karma:200, userid:4}, body:'Some comment content2222 ome comment content2222222333', upvotes:0, liked : false, reported : false}
 				 	]
 				},
 				{
 				  id:2,
 				  title: 'When does starbucks close on public holidays?',
 				  category: 'UTown',
 				  author: {name:'Steven', karma:7, userid:7},
 				  views: 25,
 				  desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam vel scelerisque quam. Pellentesque ut mattis tellus.  Aliquam vel scelerisque quam. Pellentesque ut mattis tellus.',
 					upvotes:0,
 					comments: [
 				 		{author:{name:'Bob', karma:100, userid:3}, body:'Some comment content', upvotes:0, liked : false, reported : false},
 				 		{author:{name:'Eric', karma:200, userid:4}, body:'Some comment content2222', upvotes:0, liked : false, reported : false}
 				 	]
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

    return {
        getQuestions: getQuestions,
        cancelCall: cancelCall,
        submitNewPost : submitNewPost,
        getNotifications : getNotifications
    }

}]);
