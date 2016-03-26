<?php require_once 'connect.php';
	
	//Get all Title from "Questions" database
	if($_GET["cmd"] == "title"){
		$query = "SELECT title FROM Questions";
		$result = $db->query($query);
		$title_array = array();
		while ($title = mysqli_fetch_assoc($result)){
			$title_array[] = $title['title']; 
		}
		echo json_encode($title_array);		
	}

	//Get Trending Post Top 10
	if($_GET["cmd"] == "trending"){
		$query = "SELECT * FROM Questions ORDER BY score DESC LIMIT 10";
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
			
			//$post_array[] = array_values($post);
		}
		echo json_encode($post_array);		
	}
?>