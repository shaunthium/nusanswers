<?php
	require_once 'connect.php'; //contains login constants
  $request_data = file_get_contents("php://input");
  $data = json_decode($request_data);
  $cmd = $data->cmd;
	// if(isset($_POST["question_id"]))
  // if (isset($data->question_id)) {
  //   $question_id = $data->question_id;
  // }
  // if (isset($data->answer_id)) {
  //   $answer_id = $data->answer_id;
  // }
  // if (isset($data->user_id)) {
  //   $user_id = $data->user_id;
  // }
  // if (isset($data->content)) {
  //   $content = $data->content;
  // }
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
	*
	*/
	if($cmd == "getanswers" and $question_id >=0)
	{
		global $db;
		/*******************Query Question table ***************************/
		$query = "select Questions.*, group_concat(Tags.content) as tags from Questions inner join Questions_Tags on Questions.id = Questions_Tags.question_id inner join Tags on Questions_Tags.tag_id = Tags.id where Questions.id = " . $question_id . " group by Questions.id;";
		$res = $db->query($query);
		//| question_id | user_id | title| content| score | view_count | created_at| updated_at| tags|
		$questionResult = array();
		$questionResult = mysqli_fetch_assoc($res);


		/*******************Query Comments table ***************************/
		$query = "select Comments.id, Users.id as user_id, Comments.content, Comments.created_at, Comments.updated_at from Comments inner join Users on Users.id = Comments.user_id  where Comments.question_id = ". $question_id;
		$res = $db->query($query);
		 $commentsResult = array();
		//| comments_id |  users_id|content| created_at| updated_at |
		while($r = mysqli_fetch_assoc($res)){
			$commentsResult[] = $r;
		}


		/*******************Query Answers table ***************************/
		$query = "select Answers.id as answers_id, Answers.user_id, Answers.content, Answers.score, Answers.created_at, Answers.updated_at, Answers.chosen from Answers where question_id = ". $question_id;
		$res = $db->query($query);
		$answersResult = array();
		//| answers_id | user_id | content| score | created_at| updated_at| chosen
		while($r = mysqli_fetch_assoc($res)){
			$answersResult[] = $r;
		}

		$finalOutput = array("q"=>$questionResult, "c"=>$commentsResult, "a"=>$answersResult);
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
    $user_id = $data->user_id;
    $question_id = $data->question_id;
    $content = $data->content;
		$query = "insert into Answers (user_id, question_id, content, score, chosen) Values ($user_id, $question_id, '" . $content . "', 0, 0)";
		$db->query($query);
	}
	else if($cmd == "updateanswer")
	{
		global $db;
		$query = "update Answers set content = $content where id = $answer_id";
		$db->query($query);
	}

?>
