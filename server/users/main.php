<?php
  require_once('functions.php');

  $request_data = file_get_contents("php://input");
  $data = json_decode($request_data, true);
  // $cmd = $data->cmd;
  $cmd = $data['cmd'];
  if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if ($cmd == "show") {
      // Get user
      // $user_id = $data->user_id;
      $user_id = $data['user_id'];
      $result = get_user($user_id);

      if (!$result) {
        http_response_code(404);
        echo "Error: No such user!";
      } else {
        echo json_encode($result);
      }
    } else if ($cmd == "auth") {
      $email = $data->email;
      $password = $data->password;

      if (authenticate_user($email, $password)) {
        echo true;
      } else {
        http_response_code(403);
        echo "Error: Unauthorized.";
      }
    } else if ($cmd == "index") {
      $result = get_all_users();
      echo json_encode($result);
    } else if ($cmd == "search") {
      $result = get_users_for_search_results();
      echo json_encode($result);
    }
  }
 ?>
