<?php
  require_once('post_functions.php');

  if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if ($_POST["cmd"] == "show") {
      // Show user
      $user_id = $_POST["user_id"];
      $result = get_user($user_id);

      if (!$result) {
        http_response_code(400);
        echo "Error: No such user!";
      } else {
        echo json_encode($result);
      }
    }
  }
 ?>
