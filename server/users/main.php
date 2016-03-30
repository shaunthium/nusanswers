<?php
  require_once('post_functions.php');
  require_once('get_functions.php');

  if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $cmd = $_POST["cmd"];
    if ($cmd == "show") {
      // Get user
      $user_id = $_POST["user_id"];
      $result = get_user($user_id);

      if (!$result) {
        http_response_code(404);
        echo "Error: No such user!";
      } else {
        echo json_encode($result);
      }
    } else if ($cmd == "auth") {
      $email = $_POST["email"];
      $password = $_POST["password"];

      if (authenticate_user($email, $password)) {
        echo true;
      } else {
        http_response_code(403);
        echo "Error: Unauthorized.";
      }
    }
  } else if ($_SERVER["REQUEST_METHOD"] == "GET") {
    if ($_GET["cmd"] == "index") {
      $result = get_all_users();
      echo json_encode($result);
    } else if ($_GET["cmd"] == "search") {
      $result = get_users_for_search_results();
      echo json_encode($result);
    }
  }
 ?>
