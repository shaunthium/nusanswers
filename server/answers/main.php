<?php
  require_once('functions.php');
  
  $request_data = file_get_contents("php://input");
  
  $data = json_decode($request_data);
  
  $cmd = $data->cmd;
  //$cmd = $_POST["cmd"];
 
  if ($_SERVER["REQUEST_METHOD"] == "POST"){
	if($cmd == "upvote"){
		//WARNING: Authorization check not implemented!!
		//WARNING: Amount of upvotes not tracked!
		
		$answer_id = $data->answer_id;
		//$answer_id = $_POST["answer_id"];
		upVote($answer_id);
		
	} 
	else if ($cmd == "downvote"){
		//WARNING: Authorization check not implemented!!
		//WARNING: Amount of upvotes not tracked!
		
		$answer_id = $data->answer_id;
		//$answer_id = $_POST["answer_id"];
		downVote($answer_id);
	}
	else if ($cmd == "addanswer"){
		$user_id = $data->answer_id;
		$question_id = $data->answer_id;
		$content = $data->content;
		
		//$user_id = $_POST["user_id"];
		//$question_id = $_POST["question_id"];
		//$content = $_POST["content"];
		addAnswer($user_id, $question_id, $content);
	}
	else if ($cmd == "deleteanswer"){
		$answer_id = $data->answer_id;
		//$answer_id = $_POST["answer_id"];
		deleteAnswer($answer_id);
	}
	else if($cmd == "updateanswer"){
		$answer_id = $data->answer_id;
		$content = $data->content;
		//$answer_id = $_POST["answer_id"];
		//$content = $_POST["content"];
		updateAnswer($answer_id, $content);
	}
	else if ($cmd == "chooseanswer"){
		//$answer_id = $data->answer_id;
		//$chosen = $data->chosen;
		$answer_id = $_POST["answer_id"];
		$chosen = $_POST["chosen"];
		chooseAnswer($answer_id, $content);
	}
	else if ($cmd == "getanswers"){
		$question_id = $data->question_id;
		//$question_id = $_POST["question_id"];
		$result = getAnswers($question_id);
		echo json_encode($result);
	}
  }
?>