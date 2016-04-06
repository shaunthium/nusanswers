<?php
  require_once('../../fb.php');
  require_once('../connect.php');
  global $fb;
  global $db;

  $accessToken = $_POST["token"];
  try {
    // Returns a `Facebook\FacebookResponse` object
    $response = $fb->api('/me', $accessToken);
  } catch(Facebook\Exceptions\FacebookResponseException $e) {
    echo 'Graph returned an error: ' . $e->getMessage();
    exit;
  } catch(Facebook\Exceptions\FacebookSDKException $e) {
    echo 'Facebook SDK returned an error: ' . $e->getMessage();
    exit;
  }

  $user = $response->getGraphUser();
  print_r(error_log($user), true);

  // $query = "INSERT INTO Users (id) VALUES (" . intval($user["id"]) . ")";
  // $db->query($query);
 ?>
