<?php 
	require_once ('connect.php');

	if(isset($_POST["cmd"])){
		$cmd = $_POST["cmd"];
	}

	//Tag a questions
	if($cmd == "tag_qns"){
		$qns_id = $db->escape_string($_POST["qns_id"]);
		$tag_string =  $db->escape_string($_POST["tag_string"]);
		
		$tag_array = explode(",", $tag_string);
		add_tag($tag_array);
		
		tag_qns($qns_id, $tag_array);
	}

	if($cmd == "delete_tag"){
		global $db;

		$qns_id = $db->escape_string($_POST["qns_id"]);
		$tag_string =  $db->escape_string($_POST["tag_string"]);
		
		
		if(!empty($tag_string)){
			$tag_array = explode(",", $tag_string);
			$tag_id_array = array();
			$i=0;
			foreach($tag_array as $tag){
				$query = "SELECT id FROM Tags WHERE content='" . $tag . "'";
				$result = $db->query($query);
				$row = mysqli_fetch_array($result);
				$tag_id_array[$i++] = $row['id'];
			}
			
			foreach($tag_id_array as $tag_id){
				$query = "DELETE FROM Questions_Tags WHERE question_id=" . $qns_id . " AND tag_id=" . $tag_id;
				$db->query($query);
			}
			
		}		
	}
	
	//Insert new tag to 'Tags' table, if tag exist inside the 'Tags' table, it will not be inserted 
	function add_tag($tag_array){	
		global $db;
		foreach($tag_array as $tag){
			$sanitised_tag =  $db->escape_string($tag);
			$query = "INSERT INTO Tags(content) VALUES('". $sanitised_tag ."')";		
			$db->query($query);
		}
	}

	//Insert new entry of question_id & tag_id into 'Questions_Tags' table
	function tag_qns($qns_id, $tag_array){
		global $db;
		foreach($tag_array as $tag){
			$query = "SELECT id FROM Tags WHERE content='" . $tag . "'";
			$result = $db->query($query);
			$row = mysqli_fetch_array($result);
			$tag_id = $row['id'];

			$query_tag_qns = "INSERT INTO Questions_Tags VALUES(". $qns_id . "," . $tag_id . ")";
			$db->query($query_tag_qns);
		}
	}

?>