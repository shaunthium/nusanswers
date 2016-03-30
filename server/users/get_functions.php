<?php
  require_once('../connect.php');

  function get_all_users() {
    global $db;
    $query = "SELECT * FROM Users";

    $sql_result = $db->query($query);
    $result = array();
    while (($row = mysqli_fetch_row($sql_result)) != null) {
      $user = array();
      $user["id"] = $row[0];
      $user["first_name"] = $row[1];
      $user["last_name"] = $row[2];
      $user["email"] = $row[3];
      $user["role"] = $row[5];
      $user["score"] = $row[6];
      $user["created_at"] = $row[7];
      $user["updated_at"] = $row[8];
      // Push user into array
      $result[] = $user;
    }
    return $result;
  }

  function get_users_for_search_results() {
    global $db;
    $query = "SELECT id, first_name, last_name FROM Users";

    $sql_result = $db->query($query);
    $result = array();
    while (($row = mysqli_fetch_row($sql_result)) != null) {
      $user = array();
      $user["id"] = $row[0];
      $user["first_name"] = $row[1];
      $user["last_name"] = $row[2];
      // Push user into array
      $result[] = $user;
    }
    return $result;
  }
 ?>
