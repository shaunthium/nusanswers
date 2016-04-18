'use strict';

angular.module('quoraApp')
.service('questionService', ['$q', '$http', function($q, $http){

    // var base_url = "http://139.59.247.83/";
    var base_url = '';
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
	// var posts = [{
 // 				  id:0,
 // 				  title: 'When does Indian open on Sundays?',
 // 				  tags: ['Latest', "Tags", "MoreTags", "EvenMoreTags"],
 // 				  author:{name:'User1', karma:100, userid:2},
 // 				  views: 10,
 // 				  desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam vel scelerisque quam. Pellentesque ut mattis tellus. Donec maximus elementum nibh eget gravida. In sed leo a lectus suscipit porta. Fusce ornare sem vel sem viverra tempor. Aenean et tempus sapien. Donec sit amet mollis nibh. Suspendisse interdum, ipsum a maximus mattis, ipsum nibh viverra ipsum, eget facilisis enim mauris vitae urna. Mauris vulputate libero sed dapibus tristique. Nullam at ante a nisi porttitor rhoncus.',
 // 					upvotes:0,
 // 					comments: [
 // 				 		{author:{name:'Bob', karma:100, userid:3}, body:'Some comment content', upvotes:0, liked : false, reported : false, id:id++},
 // 				 		{author:{name:'Eric', karma:200, userid:4}, body:'Some comment content2222 ome comment content2233322', upvotes:1, liked : false, reported : false, id:id++}
 // 				 	]},
 // 				 {
 // 				  id:1,
 // 				  title: 'Why is nobody asking questions during lecture?',
 // 				  tags: ['Lectures', "Latest", "Tags"],
 // 				  author: {name:'User2', karma:150, userid:5},
 // 				  views: 25,
 // 				  desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.In sed leo a lectus suscipit porta. Suspendisse interdum, ipsum a maximus mattis, ipsum nibh viverra ipsum, eget facilisis enim mauris vitae urna. Mauris vulputate libero sed dapibus tristique. Nullam at ante a nisi porttitor rhoncus.',
 // 					upvotes:0,
 // 					comments: [
 // 				 		{author:{name:'Bob', karma:100, userid:3}, body:'Some comment content', upvotes:0, liked : false, reported : false, id:id++},
 // 				 		{author:{name:'Eric', karma:200, userid:4}, body:'Some comment content2222 ome comment content2222222333', upvotes:0, liked : false, reported : false, id:id++}
 // 				 	]
 // 				},
 // 				{
 // 				  id:2,
 // 				  title: 'When does starbucks close on public holidays?',
 // 				  tags: ['UTown', "Tags"],
 // 				  author: {name:'Steven', karma:7, userid:7},
 // 				  views: 25,
 // 				  desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam vel scelerisque quam. Pellentesque ut mattis tellus.  Aliquam vel scelerisque quam. Pellentesque ut mattis tellus.',
 // 					upvotes:0,
 // 					comments: [
 // 				 		{author:{name:'Bob', karma:100, userid:3}, body:'Some comment content', upvotes:0, liked : false, reported : false, id:id++},
 // 				 		{author:{name:'Eric', karma:200, userid:4}, body:'Some comment content2222', upvotes:0, liked : false, reported : false, id:id++}
 // 				 	]
 // 				}];


    var notifications = ["Notification 1","Notification 2","Notification 3","Notification 4"];
    /*END HARDCODED SERVER REPLY OBJECTS*/

    function getQuestions(feedType, startIndex, requestedQuestions, userID) {
        var cmd;
        if(feedType === "trending"){
            cmd = "trending_qns";
        }
        else{
            cmd = "latest_qns";
        }

      return $http({
        method: 'POST',
        url: base_url + "server/questions.php",
        data: {
          cmd   : cmd,
          user_id : userID,
          index : startIndex,
          limit : requestedQuestions
        },
        dataType: 'json'
      });
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

    // send params:
    // cmd : new_qns
    // data : user_id, title, content, tag_string (comma separated tags)
    function submitNewPost(userID, title){
        /*var serverReply = JSON.parse(JSON.stringify(newPost));
        serverReply.title = title;
        serverReply.author = user;
        return serverReply;*/
        return $http({
          url: base_url + "server/questions.php",
          method: "POST",
          data: {
            cmd: "new_qns",
            user_id: userID,
            title : title,
            content : "",
            tag_string : ""
          }
        });

    }

    /*FIXME: should we sanitize input before sending it to the server?*/
    function submitNewComment(commentBody, userID, postID){

        //This function should add the comment to the post server-side and return a comment object, which will be attached to the post client-side.
        return $http({
          url: base_url + "server/comment_qns.php",
          method: "POST",
          data: {
            cmd: "new_comment_qns",
            comment : commentBody,
            user_id: userID,
            qns_id : postID
          }
        });
    }

    function addCommentToAnswer(commentBody, userID, answerID){

        // console.log("user_id" + userID);
        // console.log("content " + answerID)
        // console.log("content " + commentBody)

        return $http({
          url: base_url + "server/answers.php",
          method: "POST",
          data: {
            cmd: "createcomment",
            content : commentBody,
            user_id: userID,
            answer_id : answerID
          }
        });
    }

    function deleteCommentFromAnswer(commentID, userID){
        return $http({
          url: base_url + "server/answers.php",
          method: "POST",
          data: {
            cmd: "deletecomment",
            user_id: userID,
            comment_id : commentID
          }
        });
    }

    //FIXME: I AM A PROTOTYPE
    //TODO: BACK-END INTEGRATION
    function getCommentsFromAnswer(postID, userID){

        // console.log("userID", userID);
        // console.log("Ans id ", postID);

        return $http({
          url: base_url + "server/answers.php",
          method: "POST",
          data: {
            cmd: "getcomments",
            user_id: userID,
            answer_id : postID
          }
        });
    }

    function submitDeleteComment(commentID, userID){
        return $http({
          url: base_url + "server/comment_qns.php",
          method: "POST",
          data: {
            cmd: "delete_comment_qns",
            user_id: userID,
            comment_id : commentID
          }
        });
    }

    function getAnswersToCurrentPost(postID){
      return $http({
        url: base_url + "server/answers.php",
        method: "POST",
        data: {
          cmd: "getanswers",
          question_id: postID
        }
      });
    }

    function submitAnswerToPost(postID, userID, content){
      //console.log("Submitting answer to post ... ");

      // console.log("Sending from userID " , userID);

      return $http({
        url: base_url + "server/answers.php",
        method: 'POST',
        data: {
          cmd: "createanswer",
          user_id: userID,
          question_id: postID,
          content: content
        }
      });
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

    function submitUpvotePost(postID, userID, type){
        if (type != 'answer') {
            return $http({
                method: "POST",
                url: base_url + "server/questions.php",
                data: {
                    cmd: 'set_up_vote_qns',
                    qns_id: postID,
                    user_id: userID
                }
            });
        } else {
            return $http({
                method: 'POST',
                url: base_url + 'server/answers.php',
                data: {
                    cmd: 'upvote',
                    answer_id: postID,
                    user_id: userID
                }
            });
        }
    }

    function submitCancelUpvotePost(postID, userID, type){
        if (type != 'answer') {
            return $http({
                method: "POST",
                url: base_url + "server/questions.php",
                data: {
                    cmd: 'reset_up_vote_qns',
                    qns_id: postID,
                    user_id: userID
                }
            });
        } else {
            return $http({
                method: 'POST',
                url: base_url + 'server/answers.php',
                data: {
                    cmd: 'upvote', //FIXME: server-side it's weird to use toggle for answers and "set/reset" for questions...
                    answer_id: postID,
                    user_id: userID
                }
            });
        }
    }

    function submitDownvotePost(postID, userID, type){
        if (type != 'answer') {
            return $http({
                method: "POST",
                url: base_url + "server/questions.php",
                data: {
                    cmd: 'set_down_vote_qns',
                    qns_id: postID,
                    user_id: userID
                }
            });
        } else {
            return $http({
                method: 'POST',
                url: base_url + 'server/answers.php',
                data: {
                    cmd: 'downvote',
                    answer_id: postID,
                    user_id: userID
                }
            });
        }
    }

    function submitCancelDownvotePost(postID, userID, type){
        if (type != 'answer') {
            return $http({
                method: "POST",
                url: base_url + "server/questions.php",
                data: {
                    cmd: 'reset_down_vote_qns',
                    qns_id: postID,
                    user_id: userID
                }
            });
        } else {
            return $http({
                method: 'POST',
                url: base_url + 'server/answers.php',
                data: {
                    cmd: 'downvote', //FIXME: server-side it's weird to use toggle for answers and "set/reset" for questions...
                    answer_id: postID,
                    user_id: userID
                }
            });
        }
    }

    function getCommentsFromQuestion(postID){
      // console.log("sending post id ", postID);
      return $http({
         method: "POST",
         url: base_url + "server/comment_qns.php",
         data: {
           cmd: 'get_all_comments_qns',
           qns_id: postID
         }
       });
    }

    function upvoteQuestionComment(commentID, userID){
        return $http({
           method: "POST",
           url: base_url + "server/comment_qns.php",
           data: {
             cmd: 'set_upvote_comment',
             comment_id : commentID,
             user_id : userID
           }
         });
    }

    function cancelUpvoteQuestionComment(commentID, userID){
        return $http({
           method: "POST",
           url: base_url + "server/comment_qns.php",
           data: {
             cmd: 'reset_upvote_comment',
             comment_id : commentID,
             user_id : userID
           }
         });
    }

    function submitUpvoteComment(commentID, userID){
        return $http({
          url: base_url + "server/comment_qns.php",
          method: "POST",
          data: {
            cmd: "set_upvote_comment",
            user_id: userID,
            comment_id : commentID
          }
        });
    }

    function submitCancelUpvoteComment(commentID, userID){
        return $http({
          url: base_url + "server/comment_qns.php",
          method: "POST",
          data: {
            cmd: "reset_upvote_comment",
            user_id: userID,
            comment_id : commentID
          }
        });
    }

    //TODO: implement back-end integration
    function submitCancelDownvoteComment(postID, commentID, user){
        return false;
    }

    //TODO: implement back-end integration
    function submitGetTrendingTags(){
        // return ['These', 'are', 'sample', 'tags', 'Lectures', 'Latest', 'UTown'];
        return $http({
          url: base_url + "server/tags.php",
          method: "POST",
          data: {
            cmd: "get_trending_tag"
          }
        });

    }

    function getPost(postID, userID){
      // return $http({
      //   url: base_url + "server/questions.php",
      //   method: 'POST',
      //   data: {
      //     cmd: 'get_qns_info',
      //     qns_id: postID
      //   }
      // });
      return $http({
        url: base_url + 'server/answers.php',
        method: 'POST',
        data: {
          cmd: 'getanswers',
          question_id: postID,
          user_id : userID
        }
      });
    }

    function getCurrentUser(id, token) {
      return $http({
        url: base_url + 'server/users/main.php',
        method: 'POST',
        data: {
          cmd: 'create',
          user_id: id,
          token: token
        }
      });
    }
    //
    // function getPost(id) {
    //   return $http({
    //     url: base_url + 'server/questions.php',
    //     method: 'POST',
    //     data: {
    //       cmd: 'get_qns_info',
    //       qns_id: id
    //     }
    //   });
    // }

    function getQuestionsSummary(){
        return $http({
          url: base_url + 'server/search_qns_tags.php',
          method: 'POST',
          data: {
            cmd: 'get_all_qns_tags'
          }
        });
    }

    //FIXME: Verify back-end: for addTag and removeTag, the format was updated from CSV string to JSON_encoded array.
    function addTag(questionID, tag){
        return $http({
          url: base_url + 'server/tags.php',
          method: 'POST',
          data: {
            cmd: 'tag_qns',
            qns_id : questionID,
            tag_string : tag
          }
        });
    }

    //FIXME: Verify back-end: for addTag and removeTag, the format was updated from CSV string to JSON_encoded array.
    function removeTag(questionID, tag){
        return $http({
          url: base_url + 'server/tags.php',
          method: 'POST',
          data: {
            cmd: 'delete_tag',
            qns_id : questionID,
            tag_string : tag
          }
        });
    }

    function editQuestion(questionID, title, content){
        return $http({
            url: base_url + 'server/questions.php',
            method: 'POST',
            data: {
                cmd: 'edit_qns',
                qns_id : questionID,
                title : title,
                content : content
           }
        });
    }

    function deleteQuestion(questionID, userID){
        return $http({
            url: base_url + 'server/questions.php',
            method: 'POST',
            data: {
                cmd: 'delete_qns',
                qns_id : questionID,
                user_id : userID
            }
        });
    }

    function editAnswer(answerID, content, userID){
        return $http({
            url: base_url + 'server/answers.php',
            method: 'POST',
            data: {
                cmd: 'editanswer',
                answer_id : answerID,
                content : content,
                user_id : userID
            }
        });
    }

    function deleteAnswer(answerID, userID){
        return $http({
            url: base_url + 'server/answers.php',
            method: 'POST',
            data: {
                cmd: 'deleteanswer',
                answer_id : answerID,
                user_id : userID
            }
        });
    }

    function getAllTags(){
        return $http({
            url: base_url + 'server/tags.php',
            method: 'POST',
            data: {
                cmd: 'get_all_tags'
            }
        });
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
        submitGetTrendingTags       :   submitGetTrendingTags,
        submitAnswerToPost          :   submitAnswerToPost,
        getPost                     :   getPost,
        getCommentsFromQuestion     :   getCommentsFromQuestion,
        getNotifications            :   getNotifications,
        getAnswersToCurrentPost     :   getAnswersToCurrentPost,
        getCurrentUser              :   getCurrentUser,
        getQuestionsSummary         :   getQuestionsSummary,
        addTag                      :   addTag,
        removeTag                   :   removeTag,
        editQuestion                :   editQuestion,
        deleteQuestion              :   deleteQuestion,
        editAnswer                  :   editAnswer,
        deleteAnswer                :   deleteAnswer,
        addCommentToAnswer          :   addCommentToAnswer,
        getCommentsFromAnswer       :   getCommentsFromAnswer,
        deleteCommentFromAnswer     :   deleteCommentFromAnswer,
        getAllTags                  :   getAllTags
    }

}]);
