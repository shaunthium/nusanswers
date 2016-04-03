<?php
	require_once('../connect.php');
	
	/*
	* Currently gets question/answers/comments. All info enough to fill a page
	*/
	function getAnswers($question_id){
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
		
		return $finalOutput;
	}
	
	/*
	* Description: Increases the score of BOTH Answer and its User by 1
	*/
	function upVote($answer_id)
	{
		global $db;
		
		$query = "CALL UpVoteAnswer($answer_id)";
		$db->query($query);
	}
	
	/*
	* Description: Decreases the score of BOTH Answer and its User by 1
	*/
	function downVote($answer_id)
	{
		global $db;
		
		$query = "CALL DownVoteAnswer($answer_id)";
		$db->query($query);
	}
	
	/*
	* Description: Adds a new answer to a question.
	*				The score and chosen values are defaulted to 0.
	*/
	function addAnswer($user_id, $question_id, $content)
	{
		global $db;
		
		$query = "insert into Answers (user_id, question_id, content, score, chosen) Values ($user_id, $question_id, '$content', 0, 0)";
		$db->query($query);
	}
	
	/*
	 * Description: Deletes an answer based on its answer_id
	*/
	function deleteAnswer($answer_id){
		//WARNING: Authorization check not implemented!!
		global $db;
		$query = "CALL DeleteAnswer($answer_id)";
		$db->query($query); 
	}
	
	function updateAnswer($answer_id, $content){
		global $db;
		$query = "update Answers set content = '$content' where id = $answer_id";
		$db->query($query);
	}
	
	function chooseAnswer($answer_id, $chosen){
		global $db;
		$query = "update Answers set chosen = 0";
		$db->query($query);
		$query = "update Answers set chosen = $chosen where id = $answer_id";
		$db->query($query);
	}
 ?>
