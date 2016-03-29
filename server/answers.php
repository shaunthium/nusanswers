<?php 
	require_once 'connect.php'; //contains login constants
	if(isset($_POST["cmd"]))
		$cmd = $_POST["cmd"];
	if(isset($_POST["qid"]))
		$queue_id = $_POST["qid"];
	
	global $db; // refer to the global variable 'db'
	
	if($cmd == "getanswers" and isset($_POST["qid"]))
	{
		/*******************Query Question table ***************************/
		$query = "select Questions.*, group_concat(Tags.content) as tags from Questions inner join Questions_Tags on Questions.id = Questions_Tags.question_id inner join Tags on Questions_Tags.tag_id = Tags.id where Questions.id = " . $queue_id . " group by Questions.id;";
		
		$res = $db->query($query); 
		 //| question_id | user_id | title| content| score | view_count | created_at| updated_at| tags|
		 
		$a;
		while ($r = mysqli_fetch_row($res)) { // important command
			$a =  $r;
		}
		$questionResult = array("question_id" =>$a[0], "user_id"=>$a[1], "title"=>$a[2], "content"=>$a[3], "score"=>$a[4], "view_count"=>$a[5], "created_at"=>$a[6], "updated_at"=>$a[7], "tags"=>$a[8]);
		
		
		/*******************Query Comments table ***************************/
		$query = "select Comments.id as comments_id, Users.id as user_id, Comments.content, Comments.created_at, Comments.updated_at from Comments inner join Users on Users.id = Comments.user_id  where Comments.question_id = ". $queue_id;
		$res = $db->query($query); 
		
		 $commentsResult = array();
		//| comments_id |  users_id|content| created_at| updated_at |
		while ($r = mysqli_fetch_row($res)) { // important command
			$a =  $r;
			array_push($commentsResult, array("comments_id"=>$a[0], "user_id"=>$a[1],"content"=>$a[2],"created_at"=>$a[3],"updated_at"=>$a[4]));
		}
		
		
		
		
		
		$query = "select Answers.id as answers_id, Answers.user_id, Answers.content, Answers.score, Answers.created_at, Answers.updated_at, Answers.chosen from Answers where question_id = ". $queue_id;
		$res = $db->query($query); 
		
		$answersResult = array();
		//| answers_id | user_id | content| score | created_at| updated_at| chosen
		while ($r = mysqli_fetch_row($res)) { // important command
			array_push($answersResult,array("answers_id"=>$r[0],"user_id"=>$r[1],"content"=>$r[2],"score"=>$r[3],"created_at"=>$r[4],"updated_at"=>$r[5], "chosen"=>$r[6]));
		}
		$finalOutput = array("q"=>$questionResult, "c"=>$commentsResult, "a"=>$answersResult);
		//$finalOutput = array("q"=>$questionResult);

		echo json_encode($finalOutput);
		
	}

	

	
	
	function GetInput($cmd)
	{
		
	}
?>
