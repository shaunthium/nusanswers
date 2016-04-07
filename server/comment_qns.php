<?php
	require_once ('connect.php');

	$request_data = file_get_contents("php://input");
  	$data = json_decode($request_data);
  	$cmd = $data->cmd;

	if($cmd == "get_all_comments_qns"){
		$qns_id = $data->qns_id;

		$query = "SELECT * FROM Comments WHERE question_id=".$qns_id;
		$result = $db->query($query);
		
		$comments_array = array();

		while($comment = mysqli_fetch_assoc($result)){
			$comments_array[] = array(
				'id'=>$comment['id'],
				'user_id'=>$comment['user_id'],
				'question_id'=>$comment['question_id'],
				'content'=>$comment['content'],
				'created_at'=>$comment['created_at'],
				'updated_at'=>$comment['updated_at']
			);
		}

		echo json_encode($comments_array);
	}

	if($cmd == "new_comment_qns"){
		$user_id = $data->user_id;
		$qns_id = $data->qns_id;
		$comment = $db->escape_string($data->comment);

		$query = "INSERT INTO Comments(user_id, question_id, content) VALUES(".$user_id. ", " . $qns_id . 
					", '" . $comment . "')";

		$db->query($query);
	}

	if($cmd == "edit_comment_qns"){
		$comment_id = $data->comment_id;
		$comment = $db->escape_string($data->comment);

		$query = "UPDATE Comments SET content='".$comment."' WHERE id=".$comment_id;
		$db->query($query);
	}

	if($cmd == "delete_comment_qns"){
		$comment_id = $data->comment_id;

		$query = "DELETE FROM Comments WHERE id=".$comment_id;
		$db->query($query);
	}

?>