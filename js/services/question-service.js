'use strict';

angular.module('quoraApp')
.service('questionService', ['$q', '$http', function($q, $http){

    var base_url = "http://139.59.247.83/";
    // var base_url = '';
    var questions;
    var canceller;

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

        console.log("user_id" + userID);
        console.log("content " + answerID)
        console.log("content " + commentBody)

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

        console.log("userID", userID);
        console.log("Ans id ", postID);

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


    /* WARNING: userID is undefined here if user is NOT logged in */
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

    function editQuestion(questionID, title, content, userID){
        return $http({
            url: base_url + 'server/questions.php',
            method: 'POST',
            data: {
                cmd: 'edit_qns',
                qns_id : questionID,
                title : title,
                content : content,
                user_id : userID
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

    function loginAdmin(adminName, adminPW){

        console.log("username", adminName);
        console.log("password", adminPW);

        return $http({
          url: base_url + 'server/admin.php',
          method: 'POST',
          data: {
            cmd : 'admin_login',
            username : adminName,
            password: adminPW
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

    function getAllAnswers(){

        return $http({
            url: base_url + 'server/answers.php',
            method: 'POST',
            data: {
                cmd: 'getallanswers'
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
        getAllTags                  :   getAllTags,
        loginAdmin                  : loginAdmin,
        getAllAnswers               : getAllAnswers
    }

}]);
