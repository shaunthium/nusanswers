<?php
  require_once('../connect.php');

  function get_user($user_id) {
    global $db;
    $query = "SELECT * FROM Users WHERE id=" . $user_id;

    $sql_result = $db->query($query);
    $row = mysqli_fetch_row($sql_result);
    if (!is_null($row)) {
      $result = array();
      $result["id"] = $row[0];
      $result["first_name"] = $row[1];
      $result["last_name"] = $row[2];
      $result["email"] = $row[3];
      $result["role"] = $row[5];
      $result["score"] = $row[6];
      $result["created_at"] = $row[7];
      $result["updated_at"] = $row[8];

      return $result;
    } else {
      return false;
    }
  }

  function authenticate_user($email, $password) {
    global $db;
    $query = "SELECT password FROM Users WHERE email='" . $email . "'";

    $sql_result = $db->query($query);
    $row = mysqli_fetch_row($sql_result);
    if (!is_null($row)) {
      $saved_password = $row[0];
      return password_verify($password, $saved_password);
    } else {
      return false;
    }
  }
 ?>
