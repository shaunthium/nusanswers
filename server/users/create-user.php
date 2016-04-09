<?php
  require_once('../../fb.php');
  require_once('../connect.php');
  global $fb;
  global $db;

  $accessToken = $_POST["token"];
  try {
    // Returns a `Facebook\FacebookResponse` object
    $response = $fb->get('/me', $accessToken);
  } catch(Facebook\Exceptions\FacebookResponseException $e) {
    echo 'Graph returned an error: ' . $e->getMessage();
    exit;
  } catch(Facebook\Exceptions\FacebookSDKException $e) {
    echo 'Facebook SDK returned an error: ' . $e->getMessage();
    exit;
  }

  $user = $response->getGraphUser();

  // $check_query = "SELECT id FROM Users WHERE id=" . $user["id"];
  $check_query = "SELECT id FROM Users WHERE id=" . 1000;
  $check_result = $db->query($check_query);
  if (mysqli_fetch_row($check_result) == null) {
    // Does not exist yet, create user
    $query = "INSERT INTO Users (id) VALUES (" . intval($user["id"]) . ")";
    $db->query($query);
  }
 ?>
