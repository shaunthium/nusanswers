<?php
   require_once ('connect.php'); //contains login constants
  $request_data = file_get_contents("php://input");
  $data = json_decode($request_data);
  $cmd = $data->cmd;
	// if(isset($_POST["question_id"]))
  if (isset($data->question_id)) {
    $question_id = $data->question_id;
  }
  if (isset($data->answer_id)) {
    $answer_id = $data->answer_id;
  }
  if (isset($data->user_id)) {
    $user_id = $data->user_id;
  }
  if (isset($data->content)) {
    $content = $data->content;
  }
  if (isset($data->comment_id)) {
    $comment_id = $data->comment_id;
  }
	// 	$question_id = $_POST["question_id"];
	// if(isset($_POST["answer_id"]))
	// 	$answer_id = $_POST["answer_id"];
	// if(isset($_POST["user_id"]))
	// 	$user_id = $_POST["user_id"];
	// if(isset($_POST["content"]))
	// 	$content = $_POST["content"];



	


	/*
	* Gets details of Questions, Comments and Answers, and answers comments
	*
	* @param: question_id
	* @return: VISIT :http://www.jsoneditoronline.org/?id=313a2b0f90376c791e4b965fa4b0cdf5
	* To see how the json_encode looks like
	*/
	if($cmd == "getanswers")
	{
		global $db;
		
		$query = "select 1 as tag from Questions inner join Questions_Tags on Questions.id = Questions_Tags.question_id where Questions.id = " . $question_id;
		$res = $db->query($query);
		$havetag = mysqli_fetch_assoc($res);
		
		/* Here we get the User ID of the question */
		$query = "SELECT user_id FROM Questions where id = $question_id";
		$result = $db->query($query);
		$user_id = mysqli_fetch_assoc($result);
		$user_id = $user_id["user_id"];
		
		/* Here we get the User Info to each question */
		$query_author =  "SELECT first_name, last_name, score, Role.flavour FROM Users inner join Role on Users.role = Role.id WHERE Users.id=".$user_id;
		$result_author = $db->query($query_author);
		$author = mysqli_fetch_assoc($result_author);
		
		
		
		/* Here we get the number of answers to each question */
		$query_answers_count = "SELECT Count(1) as answers_count FROM Answers where question_id = " . $question_id;
		$result_answers_count = $db->query($query_answers_count);
		$answers_count = mysqli_fetch_assoc($result_answers_count);
		
		/*******************Query Questions Comments table ***************************/
		$query = "select Comments.id, Users.id as user_id, Comments.content, Comments.created_at, Comments.updated_at from Comments inner join Users on Users.id = Comments.user_id  where Comments.question_id = ". $question_id;
		$res = $db->query($query);
		$commentsResult = array();
		//| comments_id |  users_id|content| created_at| updated_at |
		
		if(!is_bool($res))
		{
			while($r = mysqli_fetch_assoc($res)){ //for each comment
				$user_id = $r["user_id"];
				
				/* Here we get the User Info to each comment */
				$query_author =  "SELECT first_name, last_name, score, Role.flavour FROM Users inner join Role on Users.role = Role.id WHERE Users.id=".$user_id;
				$result_author = $db->query($query_author);
				$comment_author = mysqli_fetch_assoc($result_author);
				
				$commentsResult[] = array(
					'id' => $r["id"],
					'questionid' => $question_id,
					'reported' => "false",
					'liked' => "false",
					'likes' => "0",
					'author' => array('name' =>$comment_author['first_name'] . " " . $comment_author['last_name'],
								'karma' =>$comment_author['score'],
								'userid'=>$r["user_id"],
								'flavour'=> $comment_author['flavour']),
					
					'body' => $r["content"],
					'created_at'=>$r['created_at'],
					'updated_at'=>$r['updated_at']
				);
			}
		}
		//error_log(json_encode($commentsResult));
		if(empty($havetag["tag"]) || $havetag["tag"] == null) //No Tags Found
		{
			/*******************Query Question table ***************************/
			$query = "select Questions.* from Questions where Questions.id = ". $question_id;
			$res = $db->query($query);
			//| question_id | user_id | title| content| score | view_count | created_at| updated_at| tags|
			$post = mysqli_fetch_assoc($res);
			
			//$tag_array = explode(",", $post['tags']);
			
			
			$questionResult = array(

				'id'=>$post['id'],
				'title'=>$post['title'],
				'tags' => array(),
				'author' => array('name' =>$author['first_name'] . " " . $author['last_name'],
								'karma' =>$author['score'],
								'userid'=>$post['user_id'],
								'flavour'=> $author['flavour']),
				'views'=>$post['view_count'],
				'content'=>$post['content'],
				'upvotes'=>$post['score'],
				'created_at'=>$post['created_at'],
				'updated_at'=>$post['updated_at'],
				'comments' => $commentsResult
				//'answers_count' => $answers_count["answers_count"],
			);
			
		}
		else //Has Tags
		{
			
			/*******************Query Question table ***************************/
			$query = "select Questions.*, group_concat(Tags.content) as tags from Questions inner join Questions_Tags on Questions.id = Questions_Tags.question_id inner join Tags on Questions_Tags.tag_id = Tags.id where Questions.id = " . $question_id . " group by Questions.id;";
			$res = $db->query($query);
			//| question_id | user_id | title| content| score | view_count | created_at| updated_at| tags|
			$post = mysqli_fetch_assoc($res);
			
			$tag_array = explode(",", $post['tags']);
			
			$questionResult = array(

				'id'=>$post['id'],
				'title'=>$post['title'],
				'tags' => $tag_array,
				'author' => array('name' =>$author['first_name'] . " " . $author['last_name'],
								'karma' =>$author['score'],
								'userid'=>$post['user_id'],
								'flavour'=> $author['flavour']),
				'views'=>$post['view_count'],
				'content'=>$post['content'],
				'upvotes'=>$post['score'],
				'created_at'=>$post['created_at'],
				'updated_at'=>$post['updated_at'],
				'comments' => $commentsResult
				//'answers_count' => $answers_count["answers_count"],
			);
			//error_log(json_encode($questionResult));
			
			
		}
		
		


		

		/*******************Query Answers table ***************************/
		
		$query = "select Answers.id , Answers.question_id, Answers.user_id, Answers.content, Answers.score, Answers.created_at, Answers.updated_at, Answers.chosen from Answers where question_id = ". $question_id;
		$res = $db->query($query);
		$answersResult = array();
		//| answers_id | user_id | content| score | created_at| updated_at| chosen
		if(!is_bool($res))
		{
			while($r = mysqli_fetch_assoc($res)){ //foreach answ
				
				/* Here we get the User Info to each answer */
				$user_id = $r["user_id"];
				$query_author =  "SELECT first_name, last_name, score, Role.flavour FROM Users inner join Role on Users.role = Role.id WHERE Users.id=".$user_id;
				$result_author = $db->query($query_author);
				$author = mysqli_fetch_assoc($result_author);
				
				$answers_id= $r["id"];
				
				/* Here we get the comments for each answer */
				$query = "select Answers_Comments.id, Users.id as user_id, Answers_Comments.content, Answers_Comments.created_at, Answers_Comments.updated_at from Answers_Comments inner join Users on Users.id = Answers_Comments.user_id  where Answers_Comments.answer_id = ". $answers_id;
				$res2 = $db->query($query);
				
				 $answersCommentsResult = array();
				//| comments_id |  users_id|content| created_at| updated_at |
				if(!is_bool($res2))
				{
					while($a = mysqli_fetch_assoc($res2)){
						$user_id2 = $a["user_id"];
						/* Here we get the User Info to each comment */
						$query_author2 =  "SELECT first_name, last_name, score, Role.flavour FROM Users inner join Role on Users.role = Role.id WHERE Users.id=".$user_id;
						$result_author2 = $db->query($query_author2);
						$author2 = mysqli_fetch_assoc($result_author2);
						
						$answersCommentsResult[] = array(
							'id' => $a["id"],
							'answerid' => $answers_id,
							'reported' => "false",
							'liked' => "false",
							'likes' => "0",
							'author' => array('name' =>$author2['first_name'] . " " . $author2['last_name'],
										'karma' =>$author2['score'],
										'userid'=>$a["user_id"],
										'flavour'=> $author2['flavour']),
							
							'body' => $a["content"],
							'created_at'=>$a['created_at'],
							'updated_at'=>$a['updated_at']
						);
					}
				}
				
				$answersResult[] = array(

					'id'=>$r['id'],
					'questionid' => $question_id,
					'author' => array('name'=>$author['first_name'] . " " . $author['last_name'],
									'karma'=> $author['score'], 'userid'=>$r['user_id'], 'flavour'=>$author['flavour']),
					'content'=>$r['content'],
					'upvotes'=>$r['score'],
					'created_at'=>$r['created_at'],
					'updated_at'=>$r['updated_at'],
					'chosen' => $r['chosen'],
					'comments' => $answersCommentsResult
				);
			}
		}
		
		$finalOutput = array("question"=>$questionResult,"answers"=>$answersResult);
		//error_log(json_encode($finalOutput));
		echo json_encode($finalOutput);

	}
	
	/*
	* Deletes an answer
	*
	* @param: answer_id
	*/
	else if ($cmd == "deleteanswer")
	{
		global $db;
		//WARNING: Authorization check not implemented!!
		$query = "delete from Answers where id = $answer_id";
		$res = $db->query($query);

	}
	
	
	/*
	* Toggle Likes a comment
	*
	* @param: user_id -> ID OF THE PERSON VOTING
	* @param: comment_id
	*/
	else if($cmd == "like")
	{
		
		global $db;
		
		/* Get current vote info to the Answer */
		$query = "SELECT 1 FROM  Answer_Comments_Liked_By_Users where comment_id = $comment_id and user_id = $user_id";
		$result = $db->query($query);
		

		if(mysqli_num_rows($result) == 0) //Never liked before, proceed to like!
		{
			/* Insert like entry */
			$query = "Insert Into Answer_Comments_Liked_By_Users (comment_id, user_id) Values($comment_id,$user_id)";
			$db->query($query);
			
			/* Here we get the User ID of the user who posted the Comment */
			$query = "SELECT user_id FROM Answers_Comments where id = $comment_id";
			$result = $db->query($query);
			$comment_user_id = mysqli_fetch_assoc($result);
			$comment_user_id = $comment_user_id["user_id"];
			
			/* Here we upvote the Comments likes by 1 */
			$query = "UPDATE Answers_Comments SET likes = likes + 1 where id = $comment_id";
			$db->query($query);
			
			/* Here we upvote the User score by 1*/
			$query = "UPDATE Users SET score = score + 1 where id = $comment_user_id";
			$db->query($query);
			
		}
		else //have voted before! Proceed to unlike
		{
			
			/* Remove like entry */
			$query = "Delete From Answer_Comments_Liked_By_Users where comment_id = $comment_id and user_id = $user_id";
			$db->query($query);
			
			/* Here we downvote the Comments likes by 1 */
			$query = "UPDATE Answers_Comments SET likes = likes - 1 where id = $comment_id";
			$db->query($query);
			
			/* Here we get the User ID of the user who posted the Comment */
			$query = "SELECT user_id FROM Answers_Comments where id = $comment_id";
			$result = $db->query($query);
			$comment_user_id = mysqli_fetch_assoc($result);
			$comment_user_id = $comment_user_id["user_id"];
			
			/* Here we upvote the User score by 1*/
			$query = "UPDATE Users SET score = score - 1 where id = $comment_user_id";
			$db->query($query);
		}

	}
	
	/*
	* Toggle reports a comment
	*
	* @param: user_id -> ID OF THE PERSON VOTING
	* @param: comment_id
	*/
	else if ($cmd == "report")
	{
		global $db;
		
		/* Get current vote info to the Answer */
		$query = "SELECT 1 FROM  Answer_Comments_Reported_By_Users where comment_id = $comment_id and user_id = $user_id";
		$result = $db->query($query);
		

		if(mysqli_num_rows($result) == 0) //Never reported before, proceed to report!
		{
			/* Insert report entry */
			$query = "Insert Into Answer_Comments_Reported_By_Users (comment_id, user_id) Values($comment_id,$user_id)";
			$db->query($query);
			
			/* Here we upvote the Comments likes by 1 */
			$query = "UPDATE Answers_Comments SET reports = reports + 1 where id = $comment_id";
			$db->query($query);
			
			
		}
		else //have reported before! Proceed to unreport
		{
			
			/* Remove reported entry */
			$query = "Delete From Answer_Comments_Reported_By_Users where comment_id = $comment_id and user_id = $user_id";
			$db->query($query);
			
			/* Here we downvote the Comments reports by 1 */
			$query = "UPDATE Answers_Comments SET reports = reports - 1 where id = $comment_id";
			$db->query($query);
		}
	}
	
	
	/*
	* Increases the score of the User and the Answer by 1
	*
	* @param: answer_id,
	* @param: user_id -> ID OF THE PERSON VOTING
	*/
	else if($cmd == "upvote")
	{
		
		global $db;
		//WARNING: Authorization check not implemented!!
		//WARNING: Amount of upvotes not tracked!
		
		/* Get current vote info to the Answer */
		$query = "SELECT up_vote, down_vote FROM  Answers_Voted_By_Users where answer_id = $answer_id";
		$result = $db->query($query);
		

		if(mysqli_num_rows($result) == 0) //Never voted before, proceed to upvote!
		{
			
			$answer_user_id = mysqli_fetch_assoc($result);
			$answer_user_id = $answer_user_id["up_vote"];
			
			
			/* Insert upvote entry */
			$query = "Insert Into Answers_Voted_By_Users Values($answer_id,$user_id, 1, 0)";
			$db->query($query);
			
			/* Here we get the User ID of the user who posted the Answer */
			$query = "SELECT user_id FROM Answers where id = $answer_id";
			$result = $db->query($query);
			$answer_user_id = mysqli_fetch_assoc($result);
			$answer_user_id = $answer_user_id["user_id"];
			
			/* Here we upvote the Answer score by 1 */
			$query = "UPDATE Answers SET score = score + 1 where id = $answer_id";
			$db->query($query);
			
			/* Here we upvote the User score */
			$query = "UPDATE Users SET score = score + 1 where id = $answer_user_id";
			$db->query($query);
		}
		else //have voted before!
		{
			
			$votes = mysqli_fetch_assoc($result);
			
			if($votes["down_vote"] == "1") 
			{
				
				$score = 2;
				
				/* Update upvote entry */
				$query = "Update Answers_Voted_By_Users Set up_vote = 1, down_vote = 0 where answer_id = $answer_id";
				$db->query($query);
			}
			else //up_vote == 1
			{
				
				$score = -1;
				
				/* Delete upvote entry */
				$query = "Delete from Answers_Voted_By_Users where answer_id = $answer_id";
				$db->query($query);
			}
			
			/* Here we get the User ID of the user who posted the Answer */
				$query = "SELECT user_id FROM Answers where id = $answer_id";
				$result = $db->query($query);
				$answer_user_id = mysqli_fetch_assoc($result);
				$answer_user_id = $answer_user_id["user_id"];
				
				/* Here we upvote the Answer score by $score */
				$query = "UPDATE Answers SET score = score + $score where id = $answer_id";
				$db->query($query);
				
				/* Here we upvote the User score */
				$query = "UPDATE Users SET score = score + $score where id = $answer_user_id";
				$db->query($query);
		}

	}
	
	/*
	* Decreases the score of the User and the Answer by 1
	*
	* @param: answer_id
	*/
	else if($cmd == "downvote")
	{
		
		global $db;
		//WARNING: Authorization check not implemented!!
		//WARNING: Amount of upvotes not tracked!
		
		/* Get current vote info to the Answer */
		$query = "SELECT up_vote, down_vote FROM  Answers_Voted_By_Users where answer_id = $answer_id";
		$result = $db->query($query);
		

		if(mysqli_num_rows($result) == 0) //Never voted before, proceed to downvote!
		{
			
			$answer_user_id = mysqli_fetch_assoc($result);
			$answer_user_id = $answer_user_id["down_vote"];
			
			/* Insert downvote entry */
			$query = "Insert Into Answers_Voted_By_Users Values($answer_id,$user_id, 0, 1)";
			$db->query($query);
			
			/* Here we get the User ID of the user who posted the Answer */
			$query = "SELECT user_id FROM Answers where id = $answer_id";
			$result = $db->query($query);
			$answer_user_id = mysqli_fetch_assoc($result);
			$answer_user_id = $answer_user_id["user_id"];
			
			/* Here we downvote the Answer score by 1 */
			$query = "UPDATE Answers SET score = score - 1 where id = $answer_id";
			$db->query($query);
			
			/* Here we downvote the User score */
			$query = "UPDATE Users SET score = score - 1 where id = $answer_user_id";
			$db->query($query);
		}
		else //have voted before!
		{
			$votes = mysqli_fetch_assoc($result);
			
			if($votes["up_vote"] == "1") 
			{
				$score = 2;
				
				/* Update downvote entry */
				$query = "Update Answers_Voted_By_Users Set up_vote = 0, down_vote = 1 where answer_id = $answer_id";
				$db->query($query);
			}
			else //down_vote == 1
			{
				
				$score = -1;
				
				/* Delete downvote entry */
				$query = "Delete from Answers_Voted_By_Users where answer_id = $answer_id";
				$db->query($query);
			}
			
			/* Here we get the User ID of the user who posted the Answer */
				$query = "SELECT user_id FROM Answers where id = $answer_id";
				$result = $db->query($query);
				$answer_user_id = mysqli_fetch_assoc($result);
				$answer_user_id = $answer_user_id["user_id"];
				
				/* Here we downvote the Answer score by $score */
				$query = "UPDATE Answers SET score = score - $score where id = $answer_id";
				$db->query($query);
				
				/* Here we downvote the User score */
				$query = "UPDATE Users SET score = score - $score where id = $answer_user_id";
				$db->query($query);
		}
	}
	
	/*
	* Creates a new answer only if he has not done so before.
	*
	* @param: question_id,
	* @param: user_id 
	* @param: content
	*/
	else if($cmd == "createanswer")
	{
		global $db;
		
		//Check if user has answered before
		$query = "Select 1 from Answers where question_id = $question_id and user_id = $user_id";
		$result = $db->query($query);
		
		if(mysqli_num_rows($result) == 0)
		{
			$query = "insert into Answers (user_id, question_id, content) Values ($user_id, $question_id, '$content')";
			
			$db->query($query);
		}
		else
			echo "Error: Multiple Answers";
	}
	
	/*
	* Updates an Answer's content
	*
	* @param: answer_id, content
	*/
	else if($cmd == "updateanswer")
	{
		global $db;
		$query = "update Answers set content = '$content' where id = $answer_id";
		$db->query($query);
	}
	
	/*
	* Creates a comment for an Answer
	*
	* @param: user_id, answer_id, content
	*/
	else if ($cmd == "createcomment")
	{
		global $db;
		$query = "insert into Answers_Comments (user_id, answer_id, content) Values ($user_id, $answer_id, '$content')";
		$db->query($query);
	}
	/*
	* Updates an Answer's COMMENT
	*
	* @param: comment_id, content
	*/
	else if ($cmd == "updatecomment")
	{
		global $db;
		$query = "update Answers_Comments set content = '$content' where id = $comment_id";
		$db->query($query);
	}
	/*
	* Delete's a Comment
	*
	* @param: comment_id
	*/
	else if ($cmd == "deletecomment")
	{
		global $db;
		//WARNING: Authorization check not implemented!!
		$query = "delete from Answers_Comments where id = $comment_id";
		$res = $db->query($query);
	}
	
	/*
	*	Gets the answers posted by a user sorted by latest.
	*	The question Title pertaining to the answer is also included.
	*	@param: user_id
	*	@result VISIT: http://www.jsoneditoronline.org/?id=14eeaf9a6225a352da51c25fe5afc96a
	*
	*/
	else if ($cmd == "profileanswers")
	{
		global $db;
		/* Here we get the User Info to each question */
		$query_author =  "SELECT first_name, last_name, score, Role.flavour FROM Users inner join Role on Users.role = Role.id WHERE Users.id=".$user_id;
		$result_author = $db->query($query_author);
		$author = mysqli_fetch_assoc($result_author);
		
		$query = "select Questions.title, Answers.* from Answers inner join Questions on  Questions.id = Answers.question_id where Answers.user_id = $user_id order by Answers.updated_at desc";
		$result = $db->query($query);
		$answers_array = array();
		while ($answer = mysqli_fetch_assoc($result)){
			
			$answers_array[] = array(
				'title'=>$answer['title'],
				'id'=>$answer['id'],
				'questionid'=>$answer['question_id'],
				'author' => array('name'=>$author['first_name'] . " " . $author['last_name'],
									'karma'=> $author['score'], 'userid'=>$user_id, 'flavour'=>$author['flavour']),
				'content'=>$answer['content'],
				'upvotes'=>$answer['score'],
				'created_at'=>$answer['created_at'],
				'updated_at'=>$answer['updated_at'],
				'chosen'=>$answer['chosen']
			);
			
			
		}
		//error_log(json_encode($answers_array));
		echo json_encode($answers_array);	
	}
	
	/*
	*	Gets the TOP 20 latest answers
	*	The question Title pertaining to the answer is also included.
	*   @Return VISIT: http://www.jsoneditoronline.org/?id=bfb669aaec05c2f0aa3019e971b86505
	*/
	else if ($cmd == "latestanswers")
	{
		global $db;
		
		$query = "SELECT Questions.title, Answers.* FROM Answers inner join Questions on Questions.id = Answers.question_id ORDER BY updated_at DESC LIMIT 20";
		$result = $db->query($query);
		$latest_array = array();
		while ($latest = mysqli_fetch_assoc($result)){
			
			$user_id = $latest['user_id'];
			$query_author =  "SELECT first_name, last_name, score, Role.flavour FROM Users inner join Role on Users.role = Role.id WHERE Users.id=".$user_id;
			$result_author = $db->query($query_author);
			$author = mysqli_fetch_assoc($result_author);
		
			$latest_array[] = array(
				'title'=>$latest['title'],
				'id'=>$latest['id'],
				'questionid'=>$latest['question_id'],
				'author' => array('name'=>$author['first_name'] . " " . $author['last_name'],
									'karma'=> $author['score'], 'userid'=>$user_id, 'flavour'=>$author['flavour']),
				'content'=>$latest['content'],
				'upvotes'=>$latest['score'],
				'created_at'=>$latest['created_at'],
				'updated_at'=>$latest['updated_at'],
				'chosen'=>$latest['chosen']
			);
		}
		//error_log(json_encode($latest_array));
		echo json_encode($latest_array);		
	}
	
	
?>