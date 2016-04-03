<?php 
	require_once ('connect.php');
	global $db;

	$request_data = file_get_contents("php://input");
  	$data = json_decode($request_data);
  	$cmd = $data->cmd;

	//Set the vote in the respective table
	function set_vote($table_name, $qns_id, $user_id, $up_vote, $down_vote){
		global $db;

		$query = "INSERT INTO ". $table_name . " VALUES(" . $qns_id . ", " . $user_id . ", " . $up_vote . ", " . 
					$down_vote . ")ON DUPLICATE KEY UPDATE up_vote=" . $up_vote . ", down_vote=". $down_vote;
		$db->query($query);
	}

	//Update the score in the 'Questions' table
	function update_score($qns_id, $operator){
		global $db;

		$query = "UPDATE Questions SET score = score " . $operator . " 1 WHERE id=" . $qns_id;
		$db->query($query);
	}

	//Return the name list of users who voted for a question
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
	*	Record info of users who give an up vote to a question into 'Questions_Voted_By_Users' table
	*	Update and increase the total 'score' by +1 for the question inside 'Questions' table 
	*/
	if($cmd == "set_up_vote"){
		$qns_id = $db->escape_string($data->qns_id);
		$user_id =  $db->escape_string($data->user_id);
		$table_name = "Questions_Voted_By_Users";
		$up_vote = 1;
		$down_vote = 0;
		$operator = "+";

		set_vote($table_name, $qns_id, $user_id, $up_vote, $down_vote);
		update_score($qns_id, $operator);

	}

	/*
	*	Record info of users who give an up vote to a question into 'Questions_Voted_By_Users' table
	*	Update and decrease the total 'score' by -1 for the question inside 'Questions' table 
	*/
	if($cmd == "set_down_vote"){
		$qns_id = $db->escape_string($data->qns_id);
		$user_id =  $db->escape_string($data->user_id);
		$table_name = "Questions_Voted_By_Users";
		$up_vote = 0;
		$down_vote = 1;
		$operator = "-";

		set_vote($table_name, $qns_id, $user_id, $up_vote, $down_vote);
		update_score($qns_id, $operator);
	}

	/*
	*	Reset a up vote given by a user in the 'Questions_Voted_By_Users' table
	* 	Update and decrease the total 'score' by -1 for the question inside 'Questions' table 
	*/
	if($cmd == "reset_up_vote"){
		$qns_id = $db->escape_string($data->qns_id);
		$user_id =  $db->escape_string($data->user_id);
		$table_name = "Questions_Voted_By_Users";
		$up_vote = 0;
		$down_vote = 0;
		$operator = "-";

		set_vote($table_name, $qns_id, $user_id, $up_vote, $down_vote);
		update_score($qns_id, $operator);
	}

	/*
	*	Reset a down vote given by a user in the 'Questions_Voted_By_Users' table
	* 	Update and increase the total 'score' by +1 for the question inside 'Questions' table 
	*/
	if($cmd == "reset_down_vote"){
		$qns_id = $db->escape_string($data->qns_id);
		$user_id =  $db->escape_string($data->user_id);
		$table_name = "Questions_Voted_By_Users";
		$up_vote = 0;
		$down_vote = 0;
		$operator = "+";

		set_vote($table_name, $qns_id, $user_id, $up_vote, $down_vote);
		update_score($qns_id, $operator);
	}

	//Return the total number of up_votes given to a question
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

	//Return the total number down_votes given to a question
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

	//Return the the list of users who gives a up_votes to a question
	if($cmd == "get_users_up_vote"){
		$qns_id = $db->escape_string($data->qns_id);

		$query_user_id = "SELECT user_id FROM Questions_Voted_By_Users WHERE question_id=".$qns_id . " AND up_vote=1";
		get_users_who_voted($query_user_id);
	}

	//Return the the list of users who gives a down_votes to a question
	if($cmd == "get_users_down_vote"){
		$qns_id = $db->escape_string($data->qns_id);

		$query_user_id = "SELECT user_id FROM Questions_Voted_By_Users WHERE question_id=".$qns_id . " AND down_vote=1";

		get_users_who_voted($query_user_id);
	}
?>