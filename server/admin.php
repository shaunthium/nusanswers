<?php
	require_once ('connect.php');
	global $db;

	$request_data = file_get_contents("php://input");
  	$data = json_decode($request_data);
  	$cmd = $data->cmd;

  	if($cmd == "admin_login"){
  		global $db;

  		$username = $db->escape_string($data->username);
  		$password = $db->escape_string($data->password);

  		$query = "SELECT COUNT(*) FROM Admin WHERE username='".$username."' AND password='".$password."'";
  		$result = $db->query($query);
  		$row = mysqli_fetch_assoc($result);

  		if($row['COUNT(*)'] > 0){
  			echo intval(true);
  		}else{
  			echo intval(false);
  		}
  	}

  	if($cmd == "create_admin"){
  		$username = $db->escape_string($data->username);
  		$password = $db->escape_string($data->password);

  		$query = "INSERT INTO Admin(username, password) VALUES('".$username."', '".$password."')";
  		$db->query($query);

  		$affected = $db->affected_rows;

		if( $affected > 0 ){
			echo true;
		}else{
			echo false;
		}
  	}

?>