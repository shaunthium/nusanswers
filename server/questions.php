<?php 
	require_once 'connect.php';
	if(isset($_POST["cmd"])){
		$cmd = $_POST["cmd"];
	}
	
	//Submit new questions
	if($cmd == "new_qn"){
		$user_id= $_POST["user_id"];
		$title = $db->escape_string($_POST["title"]);
		$content= $db->escape_string($_POST["content"]);

		if(empty($title) || empty($content)){
			exit("Empty title or content");
		}

		$query = "INSERT INTO Questions(user_id, title, content, score, view_count) 
			VALUES(".$user_id.",'".$title."','".$content."', 0, 0)";

		$db->query($query);
		/*
		if($db->query($query)){
			echo "Question Inserted";
		}else{
			echo "Fail to insert question";
		}
		*/

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

	//Get Trending post. The post is sorted in descending order of the Score of each post
	if($cmd == "trending"){
		$query = "SELECT * FROM Questions ORDER BY score DESC";
		$result = $db->query($query);
		$post_array = array();
		while ($post = mysqli_fetch_array($result)){
					
			//$post_array[] = array(
			$post_array[] = array(
				'id'=>$post['id'],
				'user_id'=>$post['user_id'],
				'title'=>$post['title'],
				'content'=>$post['content'],
				'score'=>$post['score'],
				'view_count'=>$post['view_count'],
				'created_at'=>$post['created_at'],
				'updated_at'=>$post['updated_at']
			);
		}
		echo json_encode($post_array);		
	}

	//Up Vote for Questions
	if($cmd == "qns_upvote"){
		$id= $_POST["id"];
		$query = "UPDATE Questions SET score = score + 1 WHERE id=" . $id;
		$db->query($query);
		/*
		if($db->query($query)){
			echo "id='" . $id . "' Up Voted";
		}else{
			echo "id='" . $id . "' Fail to up vote";		
		}
		*/
	}

	//Down Vote for Questions
	if($cmd == "qns_downvote"){
		$id= $_POST["id"];
		$query = "UPDATE Questions SET score = score - 1 WHERE id=" . $id;
		$db->query($query);
		/*
		if($db->query($query)){
			echo "id='" . $id . "' Down Voted";
		}else{
			echo "id='" . $id . "' Fail to down vote";		
		}
		*/
	}

	//View Count for Visitors Viewing the Questions every session
	if($cmd == "qns_view_count"){
		$id= $_POST["id"];
		$query = "UPDATE Questions SET view_count = view_count + 1 WHERE id=" . $id;
		$db->query($query);
		/*
		if($db->query($query)){
			echo "id='" . $id . "' Viewed";
		}else{
			echo "id='" . $id . "' Fail to view";		
		}
		*/
	}

	//////////////////////////////////////////////////////////////////////////////////////////////////////
	/* Code meant for internal testing only */
	//////////////////////////////////////////////////////////////////////////////////////////////////////
	/* 
	For testing purpose only
	Update 'score' of user using 'id'
	*/
	if($cmd == "update_score"){
		$id= $_POST["id"];
		$score = $_POST["score"];
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
		$id= $_POST["id"];
		$view_count = $_POST["view_count"];
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
		$id= $_POST["id"];
		$query = "DELETE FROM Questions WHERE id=" . $id;
		if($db->query($query)){
			echo "Row with id='" . $id . "' had been deleted";
		}else{
			echo "Fail to delete row with id='" . $id . "'";
		}
	}

?>
