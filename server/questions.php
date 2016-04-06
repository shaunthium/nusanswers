<?php 
	require_once('connect.php');
	require_once('tags.php');
	require_once('votes.php');

	$request_data = file_get_contents("php://input");
  	$data = json_decode($request_data);
  	$cmd = $data->cmd;
	
	/*
		Insert new questions into 'Questions' table
		@param: 	user_id, title, content, tag_string
		@optional:	content, tag_string	
	*/
	if($cmd == "new_qns"){
		$user_id= $db->escape_string($data->user_id);
		$title = $db->escape_string($data->title);
		$content= $db->escape_string($data->content);
		$tag_string =  $db->escape_string($data->tag_string);

		//Exit if there is no title for questions
		if(empty($title)){
			exit("Error! Title is empty");
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

		//Get the newly added question ID
		$query_id = "SELECT LAST_INSERT_ID()";
		$result = $db->query($query_id);
		$row = mysqli_fetch_array($result);
		$qns_id =  $row['LAST_INSERT_ID()'];
		
		//Add new tags and into the questions if tag_string is !empty 
		if(!empty($tag_string)){
			$tag_array = explode(",", $tag_string);
			//Call add_tag($tag_array) function inside tags.php to add new tag not in the database
			add_tag($tag_array);
			//Call tag_qns($qns_id, $tag_array) function inside tags.php to tag qns and the list of related tags together
			tag_qns($qns_id, $tag_array);
		}
		
	}

	/*
		Edit a question inside 'Questions' table
		@param:	qns_id, title, content
	*/
	if($cmd == "edit_qns"){
		$qns_id= $db->escape_string($data->qns_id);
		$title = $db->escape_string($data->title);
		$content= $db->escape_string($data->content);

		if(empty($title)){
			exit("Title is empty");
		}

		$query = "UPDATE Questions SET title='" . $title. "', content='" . $content . "' WHERE id=". $qns_id;	
		$db->query($query);	
	}

	/* 
		Delete a question from 'Questions' table
		@param: qns_id
	*/
	if($cmd == "delete_qns"){
		$qns_id= $data->qns_id;
		$query_qns_tag = "DELETE FROM Questions_Tags WHERE question_id=" . $qns_id;
		$db->query($query_qns_tag);
		$query_qns = "DELETE FROM Questions WHERE id=" . $qns_id;
		$db->query($query_qns);
		$query_vote = "DELETE FROM Questions_Voted_By_Users WHERE question_id=" . $qns_id;
		$db->query($query_vote);
	}

	/*
		Get and return all the infomation of a questions
		@param:		qns_id
		@return:	Information of a question in JSON format	
	*/
	if($cmd == "get_qns_info"){
		$qns_id= $data->qns_id;
		$query = "SELECT * FROM Questions WHERE id=" . $qns_id;
		$result = $db->query($query);
		$info_array = array();
		while ($info = mysqli_fetch_assoc($result)){
			$info_array[] = $info;
		}
		echo json_encode($info_array);		
	}

	/*
		Get and return all latest questions in descending order of id
		@return:	Information of all latest question in descending order in JSON format	
	*/
	if($cmd == "latest_qns"){
		$query = "SELECT * FROM Questions ORDER BY id DESC";
		$result = $db->query($query);
		$latest_array = array();
		while ($latest = mysqli_fetch_assoc($result)){
			
			$user_id = $latest['user_id'];
			$query_author =  "SELECT first_name, last_name FROM Users WHERE id=".$user_id;
			$result_author = $db->query($query_author);
			$author = mysqli_fetch_assoc($result_author);
		
			$latest_array[] = array(

				'id'=>$latest['id'],
				'user_id'=>$latest['user_id'],
				'title'=>$latest['title'],
				'content'=>$latest['content'],
				'score'=>$latest['score'],
				'view_count'=>$latest['view_count'],
				'created_at'=>$latest['created_at'],
				'updated_at'=>$latest['updated_at'],
				'author' => $author['first_name'] . " " . $author['last_name']
			);
		}
		echo json_encode($latest_array);		
	}

	/*
		Get and return all trending questions in descending order of view_count
		@return:	Information of all trending question in descending order in JSON format	
	*/
	if($cmd == "trending_qns"){
		$query = "SELECT * FROM Questions ORDER BY view_count DESC";
		$result = $db->query($query);
		$trending_array = array();
		while ($trending = mysqli_fetch_assoc($result)){
			
			$user_id = $trending['user_id'];
			$query_author =  "SELECT first_name, last_name FROM Users WHERE id=".$user_id;
			$result_author = $db->query($query_author);
			$author = mysqli_fetch_assoc($result_author);
		
			$trending_array[] = array(

				'id'=>$trending['id'],
				'user_id'=>$trending['user_id'],
				'title'=>$trending['title'],
				'content'=>$trending['content'],
				'score'=>$trending['score'],
				'view_count'=>$trending['view_count'],
				'created_at'=>$trending['created_at'],
				'updated_at'=>$trending['updated_at'],
				'author' => $author['first_name'] . " " . $author['last_name']
			);
		}
		echo json_encode($trending_array);		
	}

	/*
		Up vote a question
		@'votes.php' : vote_qns($cmd, $table_name, $qns_id, $user_id)
		@param:	qns_id, user_id
	*/
	if($cmd == "set_up_vote_qns"){
		$qns_id= $db->escape_string($data->qns_id);
		$user_id= $db->escape_string($data->user_id);
		$table_name = "Questions_Voted_By_Users";

		vote_qns($cmd, $table_name, $qns_id, $user_id);		
	}

	/*
		Down vote a question
		@'votes.php' : vote_qns($cmd, $table_name, $qns_id, $user_id)
		@param:	qns_id, user_id
	*/
	if($cmd == "set_down_vote_qns"){
		$qns_id= $db->escape_string($data->qns_id);
		$user_id= $db->escape_string($data->user_id);
		$table_name = "Questions_Voted_By_Users";

		vote_qns($cmd, $table_name, $qns_id, $user_id);
	}

	/*
		Undo up vote a question
		@'votes.php' : vote_qns($cmd, $table_name, $qns_id, $user_id)
		@param:	qns_id, user_id
	*/
	if($cmd == "reset_up_vote_qns"){	
		$qns_id= $db->escape_string($data->qns_id);
		$user_id= $db->escape_string($data->user_id);
		$table_name = "Questions_Voted_By_Users";

		vote_qns($cmd, $table_name, $qns_id, $user_id);
	}

	/*
		Undo down vote a question
		@'votes.php' : vote_qns($cmd, $table_name, $qns_id, $user_id)
		@param:	qns_id, user_id
	*/
	if($cmd == "reset_down_vote_qns"){		
		$qns_id= $db->escape_string($data->qns_id);
		$user_id= $db->escape_string($data->user_id);
		$table_name = "Questions_Voted_By_Users";

		vote_qns($cmd, $table_name, $qns_id, $user_id);
	}

	/*
		Add +1 to view_count in 'Questions' table when a vistor visits a question
		@param: qns_id
	*/
	if($cmd == "view_qns"){
		$qns_id= $db->escape_string($data->qns_id);
		$query = "UPDATE Questions SET view_count = view_count + 1 WHERE id=" . $qns_id;
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
		$id= $data->id;
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

	

?>
