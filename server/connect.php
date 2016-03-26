<?php
  // Change the below to your own personal settings for local testing
  require_once('../config.php');

  $db = new mysqli(DB_HOST, DB_USERNAME, DB_PASSWORD, DB_DATABASE);
  if ($db->connect_errno) {
    exit("Failed to connect to MySQL, exiting.");
  }
  echo "Successfully connected!";
 ?>
