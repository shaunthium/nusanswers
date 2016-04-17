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
		@return: all data of new question and author name, score
	*/
	if($cmd == "new_qns"){
		$user_id= $db->escape_string($data->user_id);
		$title = $db->escape_string($data->title);
		$content= $db->escape_string($data->content);
		//$tag_string =  $db->escape_string($data->tag_string);
		$tag_array = json_decode($data->tag_string);

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
		if(!empty($tag_array)){
		//if(!empty($tag_string)){
			//$tag_array = explode(",", $tag_string);
			//Call add_tag($tag_array) function inside tags.php to add new tag not in the database
			add_tag($tag_array);
			//Call tag_qns($qns_id, $tag_array) function inside tags.php to tag qns and the list of related tags together
			tag_qns($qns_id, $tag_array);
		}

		//Return the data of the new question including author score and name
		$query_qns_data = "SELECT * FROM Questions WHERE id=" . $qns_id;
		$result_qns_data = $db->query($query_qns_data);
		$qns_data_array = array();

		while ($qns_data = mysqli_fetch_assoc($result_qns_data)){
			//Get the first name and last name of the author from 'users' table
			$user_id = $qns_data['user_id'];
			$query_author =  "SELECT first_name, last_name, score FROM Users WHERE id=".$user_id;
			$result_author = $db->query($query_author);
			$author = mysqli_fetch_assoc($result_author);

			//Get total number of answers to each questions from 'answers' table
			$question_id = $qns_data['id'];
			$query_total_answers = "SELECT COUNT(question_id) as total_answers FROM Answers WHERE question_id="
									.$question_id;
			$result_total_answers = $db->query($query_total_answers);
			$total_answers = mysqli_fetch_assoc($result_total_answers);



			//Get all tags of a question from 'questions_tags' & 'tags' table
			$query_tag_id = "SELECT tag_id FROM Questions_Tags WHERE question_id=" . $question_id;
			$result_tag_id = $db->query($query_tag_id);

			$tag_name_array = array();


			while ($row = mysqli_fetch_assoc($result_tag_id)){

				$query_tag_name = "SELECT content FROM Tags WHERE id=" . $row['tag_id'];
				$result_tag_name = $db->query($query_tag_name);
				$tag = mysqli_fetch_assoc($result_tag_name);
				$tag_name_array[]  = $tag["content"];

			}

			$author_array = array('name'=> $author['first_name'] . " " . $author['last_name'],
									'karma' => (int)$author['score'],
									'userid' => $qns_data['user_id'],
									'flavour' => 'New User'
									);

			//Get all comment of a question including the author from 'comment' table
			$query_comment = "SELECT * FROM Comments WHERE question_id=" . $question_id;
			$result_comment = $db->query($query_comment);

			$comment_array = array();


			$qns_data_array[] = array(
				'id'=>$qns_data['id'],
				'title'=>$qns_data['title'],
				'tags'=>$tag_name_array,
				'author'=> $author_array,
				'views'=>(int)$qns_data['view_count'],
				'desc'=>$qns_data['content'],
				'upvotes'=>(int)$qns_data['score'],
				'comments'=> $comment_array,
				'total_answers' => (int)$total_answers['total_answers'],
				'total_comments'=> count($comment_array),
				'created_at'=>$qns_data['created_at'],
				'updated_at'=>$qns_data['updated_at']
				/*
				'id'=>$qns_data['id'],
				'user_id'=>$qns_data['user_id'],
				'title'=>$qns_data['title'],
				'content'=>$qns_data['content'],
				'score'=>$qns_data['score'],
				'view_count'=>$qns_data['view_count'],
				
				'author' => $author['first_name'] . " " . $author['last_name'],
				'author_score' => $author['score'],
				'total_answers' => $total_answers['total_answers']
				*/
			);
		}

		echo json_encode($qns_data_array);

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

		$affected = $db->affected_rows;
		if( $affected > 0 ){
			echo json_encode(true);
		}else{
			echo json_encode(false);
		}	
	}

	/*
		Delete a question from 'Questions' table
		@param: qns_id
	*/
	if($cmd == "delete_qns"){
		$user_id = $db->escape_string($data->user_id);
		$qns_id= $db->escape_string($data->qns_id);


		//Delete answers, answers_comments, answer_comments_liked_by_users, answer_comments_reported_by_users
		$query_ans_id = "SELECT * FROM Answers WHERE question_id=" . $qns_id;
		$result_ans_id = $db->query($query_ans_id);
		
		while($ans_id_array = mysqli_fetch_assoc($result_ans_id)){
			$ans_id = $ans_id_array['id'];

			$query_ans_comment = "SELECT * FROM Answers_Comments WHERE answer_id=" . $ans_id;
			$result_ans_comment = $db->query($query_ans_comment);
			while($ans_comment_array = mysqli_fetch_assoc($result_ans_comment)){
				$ans_comment = $ans_comment_array['id'];
				//Delete ans_liked & reported
				$query_ans_liked = "DELETE FROM Answer_Comments_Liked_By_Users WHERE comment_id=". $ans_comment;
				$db->query($query_ans_liked); 
				$query_ans_reported = "DELETE FROM Answer_Comments_Reported_By_Users WHERE comment_id=". $ans_comment;
				$db->query($query_ans_reported); 
			}

			$query_delete_ans_comment = "DELETE FROM Answers_Comments WHERE answer_id=" . $ans_id;
			$db->query($query_delete_ans_comment); 

			$query_delete_ans_voted = "DELETE FROM Answers_Voted_By_Users WHERE answer_id=" . $ans_id;
			$db->query($query_delete_ans_voted); 
		}
		$query_delete_ans_id = "DELETE FROM Answers WHERE question_id=" . $qns_id;
		$db->query($query_delete_ans_id); 

		//Delete comments, comments_liked_by_users, comments_reported_by_users
		$query_comment_id = "SELECT * FROM Comments WHERE question_id=" . $qns_id;
		$result_comment_id = $db->query($query_comment_id);

		while($comment_id_array = mysqli_fetch_assoc($result_comment_id)){
			$comment_id = $comment_id_array['id'];
			//Delete comment_liked & reported
			$query_comment_liked = "DELETE FROM Comments_Liked_By_Users WHERE comment_id=". $comment_id;
			$db->query($query_comment_liked); 
			$query_comment_reported = "DELETE FROM Comments_Reported_By_Users WHERE comment_id=". $comment_id;
			$db->query($query_comment_reported); 
		}
		$query_delete_comment_id = "DELETE FROM Comments WHERE question_id=" . $qns_id;
		$db->query($query_delete_comment_id); 

		//Others
		$query_qns_tag = "DELETE FROM Questions_Tags WHERE question_id=" . $qns_id;
		$db->query($query_qns_tag);
		//$query_qns_tag = "DELETE FROM Answers WHERE question_id=" . $qns_id;
		//$db->query($query_qns_tag);
		$query_vote = "DELETE FROM Questions_Voted_By_Users WHERE question_id=" . $qns_id;	
		$db->query($query_vote);

		$query_qns = "DELETE FROM Questions WHERE id=" . $qns_id ." AND user_id=". $user_id;	
		$db->query($query_qns);
	
		
		$affected = $db->affected_rows;
		if( $affected > 0 ){
			echo true;
		}else{
			echo false;
		}	
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

		global $db; 

		if(isset($data->index) && isset($data->limit) ){
			//$limit_qns = 10;
			$index = $data->index;
			$limit = $data->limit;
			$query = "SELECT * FROM Questions ORDER BY id DESC LIMIT " . $index . ", " . $limit;
		}else{
			$query = "SELECT * FROM Questions ORDER BY id DESC";
		}

		//$query = "SELECT * FROM Questions ORDER BY updated_at DESC";
		$result = $db->query($query);
		$latest_array = array();
		while ($latest = mysqli_fetch_assoc($result)){
			//Get the first name and last name of the author from 'users' table
			$user_id = $latest['user_id'];
			$query_author =  "SELECT first_name, last_name, score FROM Users WHERE id=".$user_id;
			$result_author = $db->query($query_author);
			$author = mysqli_fetch_assoc($result_author);

			//Get total number of answers to each questions from 'answers' table
			$question_id = $latest['id'];
			$query_total_answers = "SELECT COUNT(question_id) as total_answers FROM Answers WHERE question_id=".$question_id;
			$result_total_answers = $db->query($query_total_answers);
			$total_answers = mysqli_fetch_assoc($result_total_answers);

			//Get all tags of a question from 'questions_tags' & 'tags' table
			$query_tag_id = "SELECT tag_id FROM Questions_Tags WHERE question_id=" . $question_id;
			$result_tag_id = $db->query($query_tag_id);

			$tag_name_array = array();
			while ($row = mysqli_fetch_assoc($result_tag_id)){
				$query_tag_name = "SELECT content FROM Tags WHERE id=" . $row['tag_id'];
				$result_tag_name = $db->query($query_tag_name);
				$tag = mysqli_fetch_assoc($result_tag_name);
				$tag_name_array[]  = $tag["content"];
			}

			$author_array = array('name'=> $author['first_name'] . " " . $author['last_name'],
									'karma' => (int)$author['score'],
									'userid' => $latest['user_id'],
									'flavour' => 'New User'
									);

			//Get all comment of a question including the author from 'comment' table
			$query_comment = "SELECT * FROM Comments WHERE question_id=" . $question_id;
			$result_comment = $db->query($query_comment);

			$comment_array = array();
			while ($comment = mysqli_fetch_assoc($result_comment)){
				$query_comment_author = "SELECT * FROM Users WHERE id=" . $comment['user_id'];
				$result_comment_author = $db->query($query_comment_author);
				$comment_author = mysqli_fetch_assoc($result_comment_author);

				$comment_author_array = array('name'=> $comment_author['first_name'] . " " . $comment_author['last_name'],
									'karma' => (int)$comment_author['score'],
									'userid' => $comment_author['id'],
									'flavour' => 'New User'
									);

				$comment_array[]  = array(
						'author' => $comment_author_array,
						'body' => $comment['content'],
						'upvotes' => 0,
						'liked' => false,
						'reported' => false,
						'id' => $comment['id']
					);
			}

			//Set True  or false if user had answered the questions
			
			if(isset($data->user_id)) {
				$global_user_id = $data->user_id;
		
				$query_answered = "SELECT * FROM Answers WHERE user_id=". $global_user_id . " AND question_id=" . $question_id;
				$result_answered = $db->query($query_answered);
			
				$num_answered = mysqli_num_rows($result_answered);
			
				if($num_answered == 0){
					$answered = false;
				}else{
					$answered = true;
				}

				$query_voted = "SELECT * FROM Questions_Voted_By_Users WHERE user_id=". $global_user_id . " AND question_id=" . $question_id;
				$result_voted = $db->query($query_voted);

				$voted = mysqli_fetch_assoc($result_voted);
				$up_vote = $voted['up_vote'];
				$down_vote = $voted['down_vote'];

				if($up_vote == 1){
					$voted_up = true;
				}else{
					$voted_up = false;
				}

				if($down_vote == 1){
					$voted_down = true;
				}else{
					$voted_down = false;
				}

			}else{
				$answered = false;
				$voted_up = false;
				$voted_down = false;
			}
			


			$latest_array[] = array(

				'id'=>$latest['id'],
				'title'=>$latest['title'],
				'tags'=>$tag_name_array,
				'author'=> array('name'=> $author['first_name'] . " " . $author['last_name'],
									'karma' => (int)$author['score'],
									'userid' => $latest['user_id'],
									'flavour' => 'New User'
					),
				'views'=>(int)$latest['view_count'],
				'content'=>$latest['content'],
				'upvotes'=>(int)$latest['score'],
				'comments'=> $comment_array,
				'total_answers' => (int)$total_answers['total_answers'],
				'total_comments'=> count($comment_array),
				'answered' => $answered,
				'upvoted' => $voted_up,
				'downvoted' => $voted_down,
				'created_at'=>$latest['created_at'],
				'updated_at'=>$latest['updated_at']

				/*
				'id'=>$latest['id'],
				'user_id'=>$latest['user_id'],
				'title'=>$latest['title'],
				'content'=>$latest['content'],
				'score'=>$latest['score'],
				'view_count'=>$latest['view_count'],
				'created_at'=>$latest['created_at'],
				'updated_at'=>$latest['updated_at'],
				'author' => $author['first_name'] . " " . $author['last_name'],
				'author_score' => $author['score'],
				'total_answers' => $total_answers['total_answers']
				*/
			);
		}
		echo json_encode($latest_array);
	}

	/*
		Get and return all trending questions in descending order of view_count
		@return:	Information of all trending question in descending order in JSON format
	*/
	if($cmd == "trending_qns"){
		global $db;

		

		if(isset($data->index) && isset($data->limit) ){
			//$limit_qns = 10;
			$index = $data->index;
			$limit = $data->limit;
			$query = "SELECT * FROM Questions ORDER BY score DESC, updated_at DESC LIMIT " . $index . ", " . $limit;
		}else{
			$query = "SELECT * FROM Questions ORDER BY score DESC, updated_at DESC";
		}

		//$query = "SELECT * FROM Questions ORDER BY view_count DESC";
		$result = $db->query($query);
		$trending_array = array();
		while ($trending = mysqli_fetch_assoc($result)){
			//Get the first name and last name of the author from 'users' table
			$user_id = $trending['user_id'];
			$query_author =  "SELECT first_name, last_name, score FROM Users WHERE id=".$user_id;
			$result_author = $db->query($query_author);
			$author = mysqli_fetch_assoc($result_author);

			//Get total number of answers to each questions from 'answers' table
			$question_id = $trending['id'];
			$query_total_answers = "SELECT COUNT(question_id) as total_answers FROM Answers WHERE question_id="
									.$question_id;
			$result_total_answers = $db->query($query_total_answers);
			$total_answers = mysqli_fetch_assoc($result_total_answers);

			//Get all tags of a question from 'questions_tags' & 'tags' table
			$query_tag_id = "SELECT tag_id FROM Questions_Tags WHERE question_id=" . $question_id;
			$result_tag_id = $db->query($query_tag_id);

			$tag_name_array = array();

			while ($row = mysqli_fetch_assoc($result_tag_id)){
				$query_tag_name = "SELECT content FROM Tags WHERE id=" . $row['tag_id'];
				$result_tag_name = $db->query($query_tag_name);
				$tag = mysqli_fetch_assoc($result_tag_name);
				$tag_name_array[]  = $tag["content"];
			}

			$author_array = array('name'=> $author['first_name'] . " " . $author['last_name'],
									'karma' => (int)$author['score'],
									'userid' => $trending['user_id'],
									'flavour' => 'New User'
									);

			//Get all comment of a question including the author from 'comment' table
			$query_comment = "SELECT * FROM Comments WHERE question_id=" . $question_id;
			$result_comment = $db->query($query_comment);

			$comment_array = array();
			while ($comment = mysqli_fetch_assoc($result_comment)){
				$query_comment_author = "SELECT * FROM Users WHERE id=" . $comment['user_id'];
				$result_comment_author = $db->query($query_comment_author);
				$comment_author = mysqli_fetch_assoc($result_comment_author);

				$comment_author_array = array('name'=> $comment_author['first_name'] . " " . $comment_author['last_name'],
									'karma' => (int)$comment_author['score'],
									'userid' => $comment_author['id'],
									'flavour' => 'New User'
									);

				$comment_array[]  = array(
						'author' => $comment_author_array,
						'body' => $comment['content'],
						'upvotes' => 0,
						'liked' => false,
						'reported' => false,
						'id' => $comment['id']
					);
			}

			//Set True  or false if user had answered the questions
			
			if(isset($data->user_id)) {
				$global_user_id = $data->user_id;
		
				$query_answered = "SELECT * FROM Answers WHERE user_id=". $global_user_id . " AND question_id=" . $question_id;
				$result_answered = $db->query($query_answered);
			
				$num_answered = mysqli_num_rows($result_answered);
			
				if($num_answered == 0){
					$answered = false;
				}else{
					$answered = true;
				}

				$query_voted = "SELECT * FROM Questions_Voted_By_Users WHERE user_id=". $global_user_id . " AND question_id=" . $question_id;
				$result_voted = $db->query($query_voted);

				$voted = mysqli_fetch_assoc($result_voted);
				$up_vote = $voted['up_vote'];
				$down_vote = $voted['down_vote'];

				if($up_vote == 1){
					$voted_up = true;
				}else{
					$voted_up = false;
				}

				if($down_vote == 1){
					$voted_down = true;
				}else{
					$voted_down = false;
				}
			}else{
				$answered = false;
				$voted_up = false;
				$voted_down = false;
			}


			$trending_array[] = array(
				'id'=>$trending['id'],
				'title'=>$trending['title'],
				'tags'=>$tag_name_array,
				'author'=> $author_array,
				'views'=>(int)$trending['view_count'],
				'content'=>$trending['content'],
				'upvotes'=>(int)$trending['score'],
				'comments'=> $comment_array,
				'total_answers' => (int)$total_answers['total_answers'],
				'total_comments'=> count($comment_array),
				'answered' => $answered,
				'upvoted' => $voted_up,
				'downvoted' => $voted_down,
				'created_at'=>$trending['created_at'],
				'updated_at'=>$trending['updated_at']

				/*
				'id'=>$trending['id'],
				'user_id'=>$trending['user_id'],
				'title'=>$trending['title'],
				'content'=>$trending['content'],
				'score'=>$trending['score'],
				'view_count'=>$trending['view_count'],
				'created_at'=>$trending['created_at'],
				'updated_at'=>$trending['updated_at'],
				'author' => $author['first_name'] . " " . $author['last_name'],
				'author_score' => $author['score'],
				'total_answers' => $total_answers['total_answers']
				*/
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

	/*
		Get all questions of a user
		@param: user_id
		@return: list of questions posted by user
	*/
	if($cmd == "get_all_qns_of_user"){
		$user_id = $db->escape_string($data->user_id);
		$query = "SELECT * FROM Questions WHERE user_id=" . $user_id . " ORDER BY updated_at DESC";
		$result = $db->query($query);
		$qns_array = array();
		while ($qns = mysqli_fetch_assoc($result)){
			//Get the first name and last name of the author from 'users' table

			//Get all tags of a qns
			

			$query_tag_id = "SELECT tag_id FROM Questions_Tags WHERE question_id=" . $qns['id'];
			$result_tag_id = $db->query($query_tag_id);

			$tag_name_array = array();
			while ($row = mysqli_fetch_assoc($result_tag_id)){
				$query_tag_name = "SELECT content FROM Tags WHERE id=" . $row['tag_id'];
				$result_tag_name = $db->query($query_tag_name);
				$tag = mysqli_fetch_assoc($result_tag_name);
				$tag_name_array[]  = $tag["content"];
			}


			$qns_array[] = array(
				'id'=>$qns['id'],
				'user_id'=>$qns['user_id'],
				'title'=>$qns['title'],
				'content'=>$qns['content'],
				'score'=>(int)$qns['score'],
				'view_count'=>(int)$qns['view_count'],
				'created_at'=>$qns['created_at'],
				'updated_at'=>$qns['updated_at'],
				'tags' => $tag_name_array
			);
		}
		echo json_encode($qns_array);

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
