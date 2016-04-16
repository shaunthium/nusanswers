<?php
	require_once ('connect.php');

	global $db;
	$request_data = file_get_contents("php://input");
  	$data = json_decode($request_data);
  	$cmd = $data->cmd;
  

	if($cmd == "get_all_comments_qns"){
		$qns_id = $data->qns_id;

		$query = "SELECT * FROM Comments WHERE question_id=".$qns_id;
		$result = $db->query($query);
		
		$comments_array = array();

		while($comment = mysqli_fetch_assoc($result)){
			$query_comment_author = "SELECT * FROM Users WHERE id=" . $comment['user_id'];
			$result_comment_author = $db->query($query_comment_author);
			$comment_author = mysqli_fetch_assoc($result_comment_author);
			
			$comment_author_array = array('name'=> $comment_author['first_name'] . " " . $comment_author['last_name'],
									'karma' => $comment_author['score'],
									'userid' => $comment_author['id'],
									'flavour' => 'New User'
									);
		
			
				$comments_array[]  = array(
						'author' => $comment_author_array,
						'body' => $comment['content'],
						'upvotes' => 0,
						'liked' => false,
						'reported' => false,
						'id' => $comment['id']
					);
					
		}
		
		echo json_encode($comments_array);
	}

	if($cmd == "new_comment_qns"){
		$user_id = $db->escape_string($data->user_id);
		$qns_id = $db->escape_string($data->qns_id);
		$comment = $db->escape_string($data->comment);

		$query = "INSERT INTO Comments(user_id, question_id, content) VALUES(".$user_id. ", " . $qns_id . 
					", '" . $comment . "')";

		$db->query($query);

		//Get the newly added comment ID
		$query_id = "SELECT LAST_INSERT_ID()";
		$result = $db->query($query_id);
		$row = mysqli_fetch_array($result);
		$comment_id =  $row['LAST_INSERT_ID()'];

		//Get the info of the new updated comment
		$query_update = "SELECT * FROM Comments WHERE id=" .$comment_id. " AND user_id=". $user_id .
							" AND question_id=" . $qns_id;
		$result = $db->query($query_update);
		$comments_array = array();

		while($comment = mysqli_fetch_assoc($result)){
			$query_comment_author = "SELECT * FROM Users WHERE id=" . $comment['user_id'];
			$result_comment_author = $db->query($query_comment_author);
			$comment_author = mysqli_fetch_assoc($result_comment_author);
			
			$comment_author_array = array('name'=> $comment_author['first_name'] . " " . $comment_author['last_name'],
									'karma' => $comment_author['score'],
									'userid' => $comment_author['id'],
									'flavour' => 'New User'
									);
		
			
				$comments_array[]  = array(
						'author' => $comment_author_array,
						'body' => $comment['content'],
						'upvotes' => 0,
						'liked' => false,
						'reported' => false,
						'id' => $comment['id']
					);
					
		}
		
		echo json_encode($comments_array);

		//echo $query;
	}

	if($cmd == "edit_comment_qns"){
		$user_id = $db->escape_string($data->user_id);
		$qns_id =  $db->escape_string($data->qns_id);
		$comment_id = $db->escape_string($data->comment_id);
		$comment = $db->escape_string($data->comment);

		$query = "UPDATE Comments SET content='".$comment."' WHERE id=".$comment_id. " AND user_id=". $user_id .
					" AND question_id=" . $qns_id;
		$db->query($query);

		//Get the info of the new updated comment
		$query_update = "SELECT * FROM Comments WHERE id=" .$comment_id. " AND user_id=". $user_id .
							" AND question_id=" . $qns_id;
		$result = $db->query($query_update);
		$comments_array = array();

		while($comment = mysqli_fetch_assoc($result)){
			$query_comment_author = "SELECT * FROM Users WHERE id=" . $comment['user_id'];
			$result_comment_author = $db->query($query_comment_author);
			$comment_author = mysqli_fetch_assoc($result_comment_author);
			
			$comment_author_array = array('name'=> $comment_author['first_name'] . " " . $comment_author['last_name'],
									'karma' => $comment_author['score'],
									'userid' => $comment_author['id'],
									'flavour' => 'New User'
									);
		
			
				$comments_array[]  = array(

						'author' => $comment_author_array,
						'body' => $comment['content'],
						'upvotes' => 0,
						'liked' => false,
						'reported' => false,
						'id' => $comment['id']
					);
					
		}
		
		echo json_encode($comments_array);

	}

	if($cmd == "delete_comment_qns"){
		$comment_id = $db->escape_string($data->comment_id);
		$user_id = $db->escape_string($data->user_id);
		
		$query = "DELETE FROM Comments WHERE id=".$comment_id. " AND user_id=". $user_id;
		$result = $db->query($query);
		$affected = $db->affected_rows;
		
		if( $affected > 0 ){
			echo json_encode(true);
		}else{
			echo json_encode(false);
		}

		//echo $comment_id;
	}

	/*
		upvote a comment in a questions
		@param: user_id, comment_id
	*/
	if($cmd == "set_upvote_comment"){
		global $db;

		$user_id = $db->escape_string($data->user_id);
		$comment_id = $db->escape_string($data->comment_id);

		$query = "INSERT INTO Comments_Liked_By_Users VALUES(".$comment_id. ", ".$user_id.")";
		$db->query($query);

		$affected = $db->affected_rows;
		
		if( $affected > 0 ){
			echo true;
		}else{
			echo false;
		}

	}

	/*
		Unlike a comment in a questions
		@param: user_id, comment_id
	*/
	if($cmd == "reset_upvote_comment"){
		global $db;

		$user_id = $db->escape_string($data->user_id);
		$comment_id = $db->escape_string($data->comment_id);

		$query = "DELETE FROM Comments_Liked_By_Users WHERE user_id=".$user_id. " AND comment_id=".$comment_id;
		$db->query($query);

		$affected = $db->affected_rows;
		
		if( $affected > 0 ){
			echo true;
		}else{
			echo false;
		}

	}

	/*
		Report a comment in a questions
		@param: user_id, comment_id
	*/
	if($cmd == "set_report_comment"){
		global $db;

		$user_id = $db->escape_string($data->user_id);
		$comment_id = $db->escape_string($data->comment_id);

		$query = "INSERT INTO Comments_Reported_By_Users VALUES(".$comment_id. ", ".$user_id.")";
		$db->query($query);

		$affected = $db->affected_rows;
		
		
		if( $affected > 0 ){
			echo true;
		}else{
			echo false;
		}

	}

	/*
		Unreport a comment in a questions
		@param: user_id, comment_id
	*/
	if($cmd == "reset_report_comment"){
		global $db;

		$user_id = $db->escape_string($data->user_id);
		$comment_id = $db->escape_string($data->comment_id);

		$query = "DELETE FROM Comments_Reported_By_Users WHERE user_id=".$user_id. " AND comment_id=".$comment_id.")";
		$db->query($query);

		$affected = $db->affected_rows;
		
		
		if( $affected > 0 ){
			echo true;
		}else{
			echo false;
		}

	}

?>