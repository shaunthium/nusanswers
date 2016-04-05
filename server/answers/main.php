<?php
  require_once('functions.php');
  
  $request_data = file_get_contents("php://input");
  
  $data = json_decode($request_data);
  
  $cmd = $data->cmd;
  //$cmd = $_POST["cmd"];
 
  if ($_SERVER["REQUEST_METHOD"] == "POST"){
	if($cmd == "upVote"){
		//WARNING: Authorization check not implemented!!
		//WARNING: Amount of upvotes not tracked!
		
		$answer_id = $data->answer_id;
		 //$answer_id = $_POST["answer_id"];
		upVote($answer_id);
		
	} 
	else if ($cmd == "downVote"){
		//WARNING: Authorization check not implemented!!
		//WARNING: Amount of upvotes not tracked!
		
		$answer_id = $data->answer_id;
		// $answer_id = $_POST["answer_id"];
		downVote($answer_id);
	}
	else if ($cmd == "addAnswer"){
		$user_id = $data->answer_id;
		$question_id = $data->answer_id;
		$content = $data->content;
		
		// $user_id = $_POST["user_id"];
		 //$question_id = $_POST["question_id"];
		 //$content = $_POST["content"];
		addAnswer($user_id, $question_id, $content);
	}
	else if ($cmd == "deleteAnswer"){
		$answer_id = $data->answer_id;
		// $answer_id = $_POST["answer_id"];
		deleteAnswer($answer_id);
	}
	else if($cmd == "updateAnswer"){
		$answer_id = $data->answer_id;
		$content = $data->content;
		// $answer_id = $_POST["answer_id"];
		 //$content = $_POST["content"];
		updateAnswer($answer_id, $content);
	}
	else if ($cmd == "chooseAnswer"){
		 $answer_id = $data->answer_id;
		 $chosen = $data->chosen;
		//$answer_id = $_POST["answer_id"];
		//$chosen = $_POST["chosen"];
		chooseAnswer($answer_id, $chosen);
	}
	else if ($cmd == "getAnswers"){
		$question_id = $data->question_id;
		// $question_id = $_POST["question_id"];
		$result = getAnswers($question_id);
		//error_log("The main result is " .json_encode($result));
		echo json_encode($result);
	}
  }
?>