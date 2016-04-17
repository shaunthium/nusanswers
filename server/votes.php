<?php 
	require_once ('connect.php');
	global $db;

	$request_data = file_get_contents("php://input");
  	$data = json_decode($request_data);
  	$cmd = $data->cmd;
  	
	/*
		Option to select set or reset up vote or down vote
		@ question.php using it
	*/
	function vote_qns($cmd, $table_name, $qns_id, $user_id){
		switch ($cmd) {
			case 'set_up_vote_qns':
				set_up_vote($table_name, $qns_id, $user_id);
				break;
			case 'set_down_vote_qns':
				set_down_vote($table_name, $qns_id, $user_id);
				break;
			case 'reset_up_vote_qns':
				reset_up_vote($table_name, $qns_id, $user_id);
				break;
			case 'reset_down_vote_qns':
				reset_down_vote($table_name, $qns_id, $user_id);
				break;
			default:
				break;
		}
	}

	/*
		Set the vote in the respective table ('Questions_Voted_By_Users' table)
		@param table_name, qns_id, user_id, up_vote, down_vote
	*/
	function set_qns_vote($table_name, $qns_id, $user_id, $up_vote, $down_vote){
		global $db;

		$query = "INSERT INTO ". $table_name . " VALUES(" . $qns_id . ", " . $user_id . ", " . $up_vote . ", " . 
					$down_vote . ")ON DUPLICATE KEY UPDATE up_vote=" . $up_vote . ", down_vote=". $down_vote;
		$db->query($query);

		$affected = $db->affected_rows;
		
		if( $affected > 0 ){
			echo true;
		}else{
			echo false;
		}
	}

	/*
		Update the score(karma points) in the 'Questions' table
	*/
	function update_qns_score($qns_id, $operator){
		global $db;

		$query = "UPDATE Questions SET score = score " . $operator . " 1 WHERE id=" . $qns_id;
		$db->query($query);
	}

	function deleteEntry($qns_id, $user_id){
		global $db;

		$query = "DELETE FROM Questions_Voted_By_Users WHERE question_id=".$qns_id . " AND user_id=".$user_id;
		$db->query($query);

		$affected = $db->affected_rows;
		
		if( $affected > 0 ){
			echo true;
		}else{
			echo false;
		}

	}
	/*
		Set the up vote 
		@use by switch statment at the start
	*/
	function set_up_vote($table_name, $qns_id, $user_id){
		$up_vote = 1;
		$down_vote = 0;
		$operator = "+";
		
		check_if_user_voted($qns_id, $user_id, $operator);
		set_qns_vote($table_name, $qns_id, $user_id, $up_vote, $down_vote);		
		updateAuthorScore($qns_id, $operator);
	}

	/*
		Set the down vote 
		@use by switch statment at the start
	*/
	function set_down_vote($table_name, $qns_id, $user_id){
		$up_vote = 0;
		$down_vote = 1;
		$operator = "-";
	
		check_if_user_voted($qns_id, $user_id, $operator);
		set_qns_vote($table_name, $qns_id, $user_id, $up_vote, $down_vote);	
		updateAuthorScore($qns_id, $operator);
	}

	/*
		Reset the up vote 
		@use by switch statment at the start
	*/
	function reset_up_vote($table_name, $qns_id, $user_id){
		$up_vote = 0;
		$down_vote = 0;
		$operator = "-";
		
		check_if_user_voted($qns_id, $user_id, $operator);
		//set_qns_vote($table_name, $qns_id, $user_id, $up_vote, $down_vote);
		updateAuthorScore($qns_id, $operator);
		deleteEntry($qns_id, $user_id);
		
	}

	/*
		Reset the down vote 
		@use by switch statment at the start
	*/
	function reset_down_vote($table_name, $qns_id, $user_id){
		$up_vote = 0;
		$down_vote = 0;
		$operator = "+";
		
		check_if_user_voted($qns_id, $user_id, $operator);
		//set_qns_vote($table_name, $qns_id, $user_id, $up_vote, $down_vote);
		updateAuthorScore($qns_id, $operator);	
		deleteEntry($qns_id, $user_id);
		
		
	}

	/*
		Return the name list of users who voted for a question
		@param: query
		@return: A list of users who gave an up vote or down vote for a question 
	*/
	function get_users_who_voted($query){
		global $db;
		
		$result = $db->query($query);
		$user_name_array = array();

		while ($user_id = mysqli_fetch_array($result)){
			$query_user_name = "SELECT first_name, last_name FROM Users WHERE id=".$user_id['user_id'];
			$result_user_name = $db->query($query_user_name);

			while ($user_name = mysqli_fetch_array($result_user_name)){
				$user_name_array[] = array($user_name['first_name'], $user_name['last_name']);
			}
		}
		
		echo json_encode($user_name_array);		
	}

	/*
		Check if the user had already voted for a questions
		The function "update_qns_score" is executed if the user had not voted
		@param: $qns_id, $user_id, $operator
	*/
	function check_if_user_voted($qns_id, $user_id, $operator){
		global $db;


		$query = "SELECT * FROM Questions_Voted_By_Users WHERE question_id=" . $qns_id . 
					" AND user_id=". $user_id;
		$result = $db->query($query);
		
		
		if(mysqli_num_rows($result)){
			$votes = mysqli_fetch_array($result);
			$up_vote = $votes["up_vote"];
			$down_vote = $votes["down_vote"];

			//if($up_vote == 0 && $down_vote == 0){
				//update_qns_score($qns_id, $operator);
			//}
			if($up_vote == 1 && $operator == "-"){
				update_qns_score($qns_id, $operator);
			}
			else if($down_vote == 1 && $operator == "+"){
				update_qns_score($qns_id, $operator);
			}else{
				//Do nothing
			}
			
		}else{
			update_qns_score($qns_id, $operator);
		}
		
	}

	//Function update author score
	
	function updateAuthorScore($qns_id, $operator){
		global $db;

		$query_author_id = "SELECT * FROM Questions WHERE id=".$qns_id;
		$result_author_id = $db->query($query_author_id);
		$author_id_array = mysqli_fetch_array($result_author_id);
		$author_id = $author_id_array['user_id'];

		$query_update_score = "UPDATE Users SET score=score".$operator."1 WHERE id=".$author_id;
		$db->query($query_update_score);
	}
	

	if(isset($data->cmd)){
		$cmd = $data->cmd;
	}

	/*
		Return the total number of up_votes given to a question
		@param:	qns_id
		@return: integer value of total up votes given to a question 
	*/
	if($cmd == "get_qns_up_vote"){
		$qns_id = $db->escape_string($data->qns_id);
		$query = "SELECT up_vote FROM Questions_Voted_By_Users WHERE question_id=" . $qns_id;
		$result = $db->query($query);
		$total_up_votes = 0;
		
		while($row = mysqli_fetch_array($result)){
			$total_up_votes += $row['up_vote'];
		}

		echo json_encode($total_up_votes);
		
	}

	/*
		Return the total number of down_votes given to a question
		@param:	qns_id
		@return: integer value of total down votes given to a question 
	*/
	if($cmd == "get_qns_down_vote"){
		$qns_id = $db->escape_string($data->qns_id);
		$query = "SELECT down_vote FROM Questions_Voted_By_Users WHERE question_id=".$qns_id;
		$result = $db->query($query);
		$total_up_votes = 0;
		
		while($row = mysqli_fetch_array($result)){
			$total_up_votes += $row['down_vote'];
		}

		echo json_encode($total_up_votes);
	}

	/*
		Return the name list of users who gave an up vote for a question
		@param: qns_id
		@return: A list of users who gave an up vote for a question 
	*/
	if($cmd == "get_users_up_vote"){
		$qns_id = $db->escape_string($data->qns_id);

		$query_user_id = "SELECT user_id FROM Questions_Voted_By_Users WHERE question_id=".$qns_id . " AND up_vote=1";
		get_users_who_voted($query_user_id);
	}

	/*
		Return the name list of users who gave a down vote for a question
		@param: qns_id
		@return: A list of users who gave a down vote for a question 
	*/
	if($cmd == "get_users_down_vote"){
		$qns_id = $db->escape_string($data->qns_id);

		$query_user_id = "SELECT user_id FROM Questions_Voted_By_Users WHERE question_id=".$qns_id . " AND down_vote=1";

		get_users_who_voted($query_user_id);
	}

	/*
		Return the list of questions which the users have up voted
		@parm: user_id
		@return: List of qns_id and the status of the up_vote=true
	*/
	if($cmd == "get_all_qns_up_vote_by_user"){
		$user_id = $db->escape_string($data->user_id);
		$query_qns_id = "SELECT * FROM Questions_Voted_By_Users WHERE user_id=" . $user_id . " AND up_vote=1";
		$result_qns_id = $db->query($query_qns_id);

		$qns_up_vote_array = array();
		while($row = mysqli_fetch_array($result_qns_id)){
			$qns_up_vote_array[] = array(
				'qns_id'=>$row["question_id"],
				'up_vote'=>true
			); 
		}
		echo json_encode($qns_up_vote_array);
	}

	/*
		Return the list of questions which the users have down voted
		@parm: user_id
		@return: List of qns_id and the status of the down_vote=true
	*/
	if($cmd == "get_all_qns_down_vote_by_user"){
		$user_id = $db->escape_string($data->user_id);
		$query_qns_id = "SELECT * FROM Questions_Voted_By_Users WHERE user_id=" . $user_id . " AND down_vote=1";
		$result_qns_id = $db->query($query_qns_id);

		$qns_udown_vote_array = array();
		while($row = mysqli_fetch_array($result_qns_id)){
			$qns_down_vote_array[] = array(
				'qns_id'=>$row["question_id"],
				'down_vote'=>true
			); 
		}
		echo json_encode($qns_down_vote_array);
	}
?>