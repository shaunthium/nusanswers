<?php 
	require_once ('connect.php');

	
	$request_data = file_get_contents("php://input");
  	$data = json_decode($request_data);
  	$cmd = $data->cmd;
  	


	/*
		Get vote notifications of a user
		@param: $user_id
		@param: $index //start index of notification
		@paramL $limit //Number of notifications
		@return: list of unread notification
	*/
	if($cmd == "get_votes_notifications"){
		
		global $db;

		$user_id = $db->escape_string($data->user_id);
		
		if(isset($data->index) && isset($data->limit)){
			$limit = $data->limit;
			$index = $data->index;
			$query = "SELECT * FROM Votes_Notifications  WHERE author_id=".$user_id. " ORDER BY checked, id DESC LIMIT " . $index . ", " . $limit;
		}else{
			$query = "SELECT * FROM Votes_Notifications  where author_id=".$user_id. " ORDER BY checked, id DESC";
		}
		
		$result = $db->query($query);
		
		$notifications_array = array();
		
		while($notification = mysqli_fetch_assoc($result)){

			if($notification['voter_id'] != $user_id){
				//If type is a question
				if($notification['type_qns_ans'] == 0){
					$query_qns_voter = "SELECT * FROM Users WHERE id=" . $notification['voter_id'];
					$result_qns_voter =  $db->query($query_qns_voter);
					$qns_voter_name = mysqli_fetch_assoc($result_qns_voter);

					$query_qns_title = "SELECT * FROM Questions WHERE id=" . $notification['qns_ans_id'];
					$result_qns_title =  $db->query($query_qns_title);
					$qns_title = mysqli_fetch_assoc($result_qns_title);

					$notifications_array[] = array(
						'id' => $notification['id'],
						'voter' => $qns_voter_name['first_name']. " " . $qns_voter_name['last_name'],
						'title_content' => $qns_title['title'],
						'type_qns_ans' => $notification['type_qns_ans'],
						'type_vote' => $$notification['type_vote'],
						'checked' => $notification['checked']
					);
				}

				//If type is an answer
				if($notification['type_qns_ans'] == 1){
					$query_ans_voter = "SELECT * FROM Users WHERE id=" . $notification['voter_id'];
					$result_ans_voter =  $db->query($query_ans_voter);
					$ans_voter_name = mysqli_fetch_assoc($result_ans_voter);

					$query_ans_content = "SELECT * FROM Answers WHERE id=" . $notification['qns_ans_id'];
					$result_ans_content =  $db->query($query_ans_content);
					$ans_content = mysqli_fetch_assoc($result_ans_content);

					$notifications_array[] = array(
						'id' => $notification['id'],
						'voter' => $ans_voter_name['first_name']. " " . $ans_voter_name['last_name'],
						'title_content' => $ans_content['content'],
						'type_qns_ans' => $notification['type_qns_ans'],
						'type_vote' => $$notification['type_vote'],
						'checked' => $notification['checked']
					);
				}
			}
		}
		
		
		echo json_encode($notifications_array);
	}

	/*
		Checked notifications viewed by user, set the checked value in 'Notifications' table to true
		@param: $user_id  => CURRENT USER ID
		@param: $notification_id_string => CAN BE MULTIPLE IDs Seperated by COMMA ","
	*/
	if($cmd == "checked_notifications"){
		
		$user_id = $db->escape_string($data->user_id);
		//$notification_id_string = $db->escape_string($data->notification_id_string);
		$raw_id_array = $db->escape_string($data->id);
		//$notification_id_array = explode(",", $notification_id_string);

		$id_array = json_decode($raw_id_array);

		foreach($id_array as $id){
			//$sanitised_tag =  $db->escape_string($tag);
			$query = "UPDATE Votes_Notifications SET checked=true WHERE user_id=". $user_id . " AND id=". $id;
			$db->query($query);
		}

		$affected = $db->affected_rows;
			
		if( $affected > 0 ){
			echo true;
		}else{
			echo false;
		}
	}



?>