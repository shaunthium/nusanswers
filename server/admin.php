<?php
    if (!(isset($_SESSION))) {
      session_start();
    }
    require_once ('connect.php');

    global $db;
    $request_data = file_get_contents("php://input");
    $data = json_decode($request_data);
    $cmd = $db->escape_string($data->cmd);

  	if($cmd == "admin_login"){
        global $db;

        //$user_id = $db->escape_string($data->user_id);
  		  $username = $db->escape_string($data->username);
  		  $password = $db->escape_string($data->password);

        $cost = 10;
        $salt = "dsgdskjgbkg34weir894r83&0r3t-234-02";
        $salt = sprintf("$2a$%02d$", $cost) . $salt;
        $hash = crypt($password, $salt);

  		  $query = "SELECT * FROM Admin WHERE username='".$username."'";
        $result = $db->query($query);
        $row = mysqli_fetch_assoc($result);

  		  if($row['password'] == $hash){
            $_SESSION['admin'] = "admin";
  			    http_response_code(200);
  			    echo intval(true);
  		  }else{
            session_unset();
            session_destroy();
            //unset($_SESSION['admin']);
  			    http_response_code(401);
  			    echo intval(false);
  		  }
  	}

  	if($cmd == "create_admin"){
        $username = $db->escape_string($data->username);
  		  $password = $db->escape_string($data->password);

        $cost = 10;
        $salt = "dsgdskjgbkg34weir894r83&0r3t-234-02";
        $salt = sprintf("$2a$%02d$", $cost) . $salt;
        $hash = crypt($password, $salt);

    		$query = "INSERT INTO Admin(username, password) VALUES('".$username."', '".$hash."')";
    		$db->query($query);

  		  $affected = $db->affected_rows;

		    if( $affected > 0 ){
          http_response_code(200);
			   echo intval(true);
		    }else{
			    http_response_code(401);
			    echo intval(true);
		    }
  	}

?>
