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
	* Gets details of Questions, Comments and Answers
	*
	* VISIT :http://www.jsoneditoronline.org/?id=313a2b0f90376c791e4b965fa4b0cdf5
	* To see how the json_encode looks like
	*/
	if($cmd == "getanswers" and $question_id >=0)
	{
		$query = "select 1 as tag from Questions inner join Questions_Tags on Questions.id = Questions_Tags.question_id where Questions.id = " . $question_id;
		$res = $db->query($query);
		$havetag = mysqli_fetch_assoc($res);
		
		/* Here we get the User ID of the question */
		$query = "SELECT user_id FROM Questions where id = $question_id";
		$result = $db->query($query);
		$user_id = mysqli_fetch_assoc($result);
		$user_id = $user_id["user_id"];
		
		/* Here we get the User Info to each question */
		$query_author =  "SELECT first_name, last_name, score FROM Users WHERE id=".$user_id;
		$result_author = $db->query($query_author);
		$author = mysqli_fetch_assoc($result_author);
		
		/* Here we get the number of answers to each question */
		$query_answers_count = "SELECT Count(1) as answers_count FROM Answers where question_id = " . $question_id;
		$result_answers_count = $db->query($query_answers_count);
		$answers_count = mysqli_fetch_assoc($result_answers_count);
			
		if(empty($havetag["tag"]) || $havetag["tag"] == null) //No Tags Found
		{
			/*******************Query Question table ***************************/
			$query = "select Questions.*, '' as tags from Questions where Questions.id = ". $question_id;
			$res = $db->query($query);
			//| question_id | user_id | title| content| score | view_count | created_at| updated_at| tags|
			$post = mysqli_fetch_assoc($res);
			
			$questionResult = array(

				'id'=>$post['id'],
				'user_id'=>$post['user_id'],
				'title'=>$post['title'],
				'content'=>$post['content'],
				'score'=>$post['score'],
				'view_count'=>$post['view_count'],
				'created_at'=>$post['created_at'],
				'updated_at'=>$post['updated_at'],
				'author' => $author['first_name'] . " " . $author['last_name'],
				'author_score' =>  $author['score'],
				'answers_count' => $answers_count["answers_count"],
				'tags' => $post['tags']
			);
			
		}
		else //Has Tags
		{
			
			/*******************Query Question table ***************************/
			$query = "select Questions.*, group_concat(Tags.content) as tags from Questions inner join Questions_Tags on Questions.id = Questions_Tags.question_id inner join Tags on Questions_Tags.tag_id = Tags.id where Questions.id = " . $question_id . " group by Questions.id;";
			$res = $db->query($query);
			//| question_id | user_id | title| content| score | view_count | created_at| updated_at| tags|
			$post = mysqli_fetch_assoc($res);
			
			$questionResult = array(

				'id'=>$post['id'],
				'user_id'=>$post['user_id'],
				'title'=>$post['title'],
				'content'=>$post['content'],
				'score'=>$post['score'],
				'view_count'=>$post['view_count'],
				'created_at'=>$post['created_at'],
				'updated_at'=>$post['updated_at'],
				'author' => $author['first_name'] . " " . $author['last_name'],
				'author_score' =>  $author['score'],
				'answers_count' => $answers_count["answers_count"],
				'tags' => $post['tags']
			);
			//error_log(json_encode($questionResult));
			
			
		}
		
		


		/*******************Query Questions Comments table ***************************/
		$query = "select Comments.id, Users.id as user_id, Comments.content, Comments.created_at, Comments.updated_at from Comments inner join Users on Users.id = Comments.user_id  where Comments.question_id = ". $question_id;
		$res = $db->query($query);
		 $commentsResult = array();
		//| comments_id |  users_id|content| created_at| updated_at |
		while($r = mysqli_fetch_assoc($res)){
			$user_id = $r["user_id"];
			/* Here we get the User Info to each comment */
			$query_author =  "SELECT first_name, last_name, score FROM Users WHERE id=".$user_id;
			$result_author = $db->query($query_author);
			$author = mysqli_fetch_assoc($result_author);
			
			$commentsResult[] = array(
				'id' => $r["id"],
				'user_id' => $r["user_id"],
				'content' => $r["content"],
				'created_at'=>$r['created_at'],
				'updated_at'=>$r['updated_at'],
				'author' => $author['first_name'] . " " . $author['last_name'],
				'author_score' =>  $author['score'],
			);
		}
		//error_log(json_encode($commentsResult));

		/*******************Query Answers table ***************************/
		
		$query = "select Answers.id , Answers.user_id, Answers.content, Answers.score, Answers.created_at, Answers.updated_at, Answers.chosen from Answers where question_id = ". $question_id;
		$res = $db->query($query);
		$answersResult = array();
		//| answers_id | user_id | content| score | created_at| updated_at| chosen
		while($r = mysqli_fetch_assoc($res)){
			
			/* Here we get the User Info to each answer */
			$user_id = $r["user_id"];
			$query_author =  "SELECT first_name, last_name, score FROM Users WHERE id=".$user_id;
			$result_author = $db->query($query_author);
			$author = mysqli_fetch_assoc($result_author);
			
			$answers_id= $r["id"];
			/* Here we get the comments for each answer */
			$query = "select Answers_Comments.id, Users.id as user_id, Answers_Comments.content, Answers_Comments.created_at, Answers_Comments.updated_at from Answers_Comments inner join Users on Users.id = Answers_Comments.user_id  where Answers_Comments.answer_id = ". $answers_id;
			$res2 = $db->query($query);
			
			 $answersCommentsResult = array();
			//| comments_id |  users_id|content| created_at| updated_at |
			while($a = mysqli_fetch_assoc($res2)){
				$user_id2 = $a["user_id"];
				/* Here we get the User Info to each comment */
				$query_author2 =  "SELECT first_name, last_name, score FROM Users WHERE id=".$user_id2;
				$result_author2 = $db->query($query_author2);
				$author2 = mysqli_fetch_assoc($result_author2);
				
				$answersCommentsResult[] = array(
					'id' => $a["id"],
					'user_id' => $a["user_id"],
					'content' => $a["content"],
					'created_at'=>$a['created_at'],
					'updated_at'=>$a['updated_at'],
					'author' => $author2['first_name'] . " " . $author2['last_name'],
					'author_score' =>  $author2['score'],
				);
			}
			$answersResult[] = array(

				'id'=>$r['id'],
				'user_id'=>$r['user_id'],
				'content'=>$r['content'],
				'score'=>$r['score'],
				'created_at'=>$r['created_at'],
				'updated_at'=>$r['updated_at'],
				'chosen' => $r['chosen'],
				'author' => $author['first_name'] . " " . $author['last_name'],
				'author_score' =>  $author['score'],
				'comments' => $answersCommentsResult
			);
		}
		
		
		$finalOutput = array("question"=>$questionResult, "question_comments"=>$commentsResult, "answers"=>$answersResult);
		//error_log(json_encode($finalOutput));
		echo json_encode($finalOutput);

	}
	else if ($cmd == "deleteanswer")
	{
		global $db;
		//WARNING: Authorization check not implemented!!
		$query = "CALL DeleteAnswer($answer_id)";
		$res = $db->query($query);

	}
	else if($cmd == "upvote")
	{
		global $db;
		//WARNING: Authorization check not implemented!!
		//WARNING: Amount of upvotes not tracked!
		$query = "CALL UpVoteAnswer($answer_id)";
		$db->query($query);

	}
	else if($cmd == "downvote")
	{
		global $db;
		//WARNING: Authorization check not implemented!!
		//WARNING: Amount of upvotes not tracked!
		$query = "CALL DownVoteAnswer($answer_id)";
		$res = $db->query($query);
	}
	else if($cmd == "createanswer")
	{
		global $db;
		$query = "insert into Answers (user_id, question_id, content) Values ($user_id, $question_id, '$content')";
		$db->query($query);
	}
	else if($cmd == "updateanswer")
	{
		global $db;
		$query = "update Answers set content = '$content' where id = $answer_id";
		$db->query($query);
	}

	else if ($cmd == "createcomment")
	{
		global $db;
		$query = "insert into Answers_Comments (user_id, answer_id, content) Values ($user_id, $answer_id, '$content')";
		$db->query($query);
	}
	else if ($cmd == "updatecomment")
	{
		global $db;
		$query = "update Answers_Comments set content = '$content' where id = $comment_id";
		$db->query($query);
	}
	else if ($cmd == "deletecomment")
	{
		global $db;
		//WARNING: Authorization check not implemented!!
		$query = "delete from Answers_Comments where id = $comment_id";
		$res = $db->query($query);
	}
?>

