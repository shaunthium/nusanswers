<?php 
	require_once('connect.php');
	require_once('tags.php');

	$request_data = file_get_contents("php://input");
  	$data = json_decode($request_data);
  	$cmd = $data->cmd;
	
	//Submit new questions
	if($cmd == "new_qn"){
		$user_id= $db->escape_string($data->user_id);
		$title = $db->escape_string($data->title);
		$content= $db->escape_string($data->content);
		$tag_string =  $db->escape_string($data->tag_string);

		//Exit if there is no title for questions
		if(empty($title)){
			exit();
		}

		//Content can be empty if user decide not to add addition info to the questions
		if(!empty($content)){
			$query = "INSERT INTO Questions(user_id, title, content, score, view_count) 
				VALUES(".$user_id.",'".$title."','".$content."', 0, 0)";
		}else{
			$query = "INSERT INTO Questions(user_id, title, score, view_count) 
				VALUES(".$user_id.",'".$title."', 0, 0)";
		}

		$db->query($query);

		$query_id = "SELECT LAST_INSERT_ID()";
		$result = $db->query($query_id);
		$row = mysqli_fetch_array($result);
		$qns_id =  $row['LAST_INSERT_ID()'];
		
		//If the questions contains tag when it is created
		if(!empty($tag_string)){
			$tag_array = explode(",", $tag_string);
			//Call add_tag($tag_array) function inside tags.php to add new tag not in the database
			add_tag($tag_array);
			//Call tag_qns($qns_id, $tag_array) function inside tags.php to tag qns and the list of related tags togther
			tag_qns($qns_id, $tag_array);
		}
		
	}


	///Get all Title & content from "Questions" database
	if($cmd == "qns_title"){
		$query = "SELECT title, content FROM Questions";
		$result = $db->query($query);
		$title_array = array();
		while ($title = mysqli_fetch_assoc($result)){
			$title_array[] = $title;
		}
		echo json_encode($title_array);		
	}

	//Get Trending post. The post is sorted in descending order of the total views of each post
	if($cmd == "trending"){
		$query = "SELECT * FROM Questions ORDER BY view_count DESC";
		$result = $db->query($query);
		$post_array = array();
		while ($post = mysqli_fetch_array($result)){
					
			$user_id = $post['user_id'];
			$query_author =  "SELECT first_name, last_name FROM Users WHERE id=".$user_id;
			$result_author = $db->query($query_author);
			$author = mysqli_fetch_assoc($result_author);
		
			$post_array[] = array(

				'id'=>$post['id'],
				'user_id'=>$post['user_id'],
				'title'=>$post['title'],
				'content'=>$post['content'],
				'score'=>$post['score'],
				'view_count'=>$post['view_count'],
				'created_at'=>$post['created_at'],
				'updated_at'=>$post['updated_at'],
				'author' => $author['first_name'] . " " . $author['last_name']
			);
		}
		echo json_encode($post_array);		
	}

	//Up Vote for Questions
	if($cmd == "qns_upvote"){
		$id= $db->escape_string($data->id);
		$query = "UPDATE Questions SET score = score + 1 WHERE id=" . $id;
		$db->query($query);
	}

	//Down Vote for Questions
	if($cmd == "qns_downvote"){
		$id= $db->escape_string($data->id);
		$query = "UPDATE Questions SET score = score - 1 WHERE id=" . $id;
		$db->query($query);
	}

	//View Count for Visitors Viewing the Questions every session
	if($cmd == "qns_view_count"){
		$id= $db->escape_string($data->id);
		$query = "UPDATE Questions SET view_count = view_count + 1 WHERE id=" . $id;
		$db->query($query);
	}

	//////////////////////////////////////////////////////////////////////////////////////////////////////
	/* Code meant for internal testing only */
	//////////////////////////////////////////////////////////////////////////////////////////////////////
	/* 
	For testing purpose only
	Update 'score' of user using 'id'
	*/
	if($cmd == "update_score"){
		$id= $$data->id;
		$score = $data->score;
		$query = "UPDATE Questions SET score=". $score . " WHERE id=" . $id;
		if($db->query($query)){
			echo "Score Updated";
		}else{
			echo "Fail to update score";
		}
	}

	/* 
	For testing purpose only
	Update 'view_count' of user using 'id'
	*/
	if($cmd == "update_view"){
		$id= $data->id;
		$view_count = $data->view_count;
		$query = "UPDATE Questions SET view_count=". $view_count . " WHERE id=" . $id;
		if($db->query($query)){
			echo "View_Count Updated";
		}else{
			echo "Fail to update view_count";
		}
	}

	/* 
	For testing purpose only
	Delete row from table
	*/
	if($cmd == "delete"){
		$id= $data->id;
		$query = "DELETE FROM Questions WHERE id=" . $id;
		if($db->query($query)){
			echo "Row with id='" . $id . "' had been deleted";
		}else{
			echo "Fail to delete row with id='" . $id . "'";
		}
	}

?>
