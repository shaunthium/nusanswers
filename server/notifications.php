<?php
	require_once ('connect.php');

	
	$request_data = file_get_contents("php://input");
  	$data = json_decode($request_data);
  	$cmd = $data->cmd;
  	


	/*
		Get all notifications of a user
		@param: $user_id
		@return: list of unread notification
	*/
	if($cmd == "get_notifications"){
		$user_id = $db->escape_string($data->user_id);

		$query = "SELECT * FROM Notifications WHERE user_id=" . $user_id . " AND checked=false";
		$result = $db->query($query);
		
		$notifications_array = array();
		
		while($notification = mysqli_fetch_assoc($result)){

			$query_answerer = "SELECT * FROM Users WHERE id=" . $notification['answerer_id'];
			$result_answerer = $db->query($query_answerer);
			$answerer_name =  mysqli_fetch_assoc($result_answerer);

			$notifications_array[] = array(
				'id' => $notification['id'],
				'qns_id' => $notification['question_id'],
				'title' => $notification['title'],
				'answerer_id' => $notification['answerer_id'],
				'answerer_name' => $answerer_name['last_name'] . " "  . $answerer_name['first_name'],
				'checked' => $notification['checked']
			);
		}
		
		
		echo json_encode($notifications_array);
	}

	/*
		Checked notifications viewed by user, set the checked value in 'Notifications' table to true
		@param: $user_id  => CURRENT USER ID
		@param: $notification_id_string => CAN BE MULTIPLE IDs Seperated by  ","
	*/
	if($cmd == "checked_notifications"){
		$user_id = $db->escape_string($data->user_id);
		$notification_id_string = $db->escape_string($data->notification_id_string);

		$notification_id_array = explode(",", $notification_id_string);

		foreach($notification_id_array as $notification_id){
			//$sanitised_tag =  $db->escape_string($tag);
			$query = "UPDATE Notifications SET checked=true WHERE user_id=". $user_id . " AND id=". $notification_id;
			$db->query($query);
		}
	}



?>