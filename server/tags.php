<?php 
	require_once ('connect.php');

	$request_data = file_get_contents("php://input");
  	$data = json_decode($request_data);
  	$cmd = $data->cmd;

	/*
		Insert new tag to 'Tags' table
		If tag exist inside the 'Tags' table, it will not be inserted 
	*/
	function add_tag($tag_array){	
		global $db;
		foreach($tag_array as $tag){
			$sanitised_tag =  $db->escape_string($tag);
			$query = "INSERT INTO Tags(content) VALUES('". trim($sanitised_tag, " ") ."')";		
			$db->query($query);
		}
	}

	/*
		Insert new entry of question_id & tag_id into 'Questions_Tags' table
	*/
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

	/*
		Get and return trending tags 
	*/
	if($cmd == "get_trending_tag"){
		$query = "SELECT tag_id, COUNT(tag_id) as trend_tag from Questions_Tags GROUP BY tag_id ORDER BY trend_tag DESC";
		$result = $db->query($query);
		$tag_array = array();
		while ($tag = mysqli_fetch_assoc($result)){
			
			$tag_id = $tag['tag_id'];
			$query_tag =  "SELECT content FROM Tags WHERE id=".$tag_id;
			$result_tag = $db->query($query_tag);
			$tag_name = mysqli_fetch_assoc($result_tag);
		
			$tag_array[] = $tag_name["content"];
		}
		echo json_encode($tag_array);		
	}

	/*
		Get and return all tags
	*/
	if($cmd == "get_all_tags"){
		$query = "SELECT * FROM Tags";
		$result = $db->query($query);
		$tag_array = array();

		while ($tag = mysqli_fetch_assoc($result)){
			$tag_array[] = $tag["content"];
		}

		echo json_encode($tag_array);		
	}
	
	/*
		Get and return all tags associated with a question
		@param: qns_id
	*/
	if($cmd == "get_all_tags_of_qns"){
		$qns_id = $db->escape_string($data->qns_id);

		$query_tag_id = "SELECT tag_id FROM Questions_Tags WHERE question_id=" . $qns_id;
		$result_tag_id = $db->query($query_tag_id);

		$tag_name_array = array();
		while ($row = mysqli_fetch_assoc($result_tag_id)){
			$query_tag_name = "SELECT content FROM Tags WHERE id=" . $row['tag_id'];
			$result_tag_name = $db->query($query_tag_name);
			$tag = mysqli_fetch_assoc($result_tag_name);
			$tag_name_array[]  = $tag["content"];
		}

		echo json_encode($tag_name_array);	
	}

	/*
		Get and return all questions associated with a tag
		@param: tag_string
	*/
	if($cmd == "get_all_qns_of_tags"){
		//$tag_string = $db->escape_string($data->tag_string);
		//$tag_array = explode(",", $tag_string);
		$tag_array = json_decode($data->tag_string);

		$tag_id_array = array();
		foreach($tag_array as $tag){
			$query = "SELECT id FROM Tags WHERE content='".$tag."'";
			$result = $db->query($query);
			$tag_id_result =  mysqli_fetch_assoc($result);
			$tag_id_array[] =  $tag_id_result['id'];
		}

		$query_qns_id = "SELECT DISTINCT question_id FROM Questions_Tags WHERE tag_id=".$tag_id_array[0];

		$size = count($tag_id_array);
		for($i=1; $i<$size; $i++){
			$query_qns_id = $query_qns_id . " OR tag_id=" . $tag_id_array[$i];
		}
		$qns_array = array();
		$qns_id_result = $db->query($query_qns_id);

		foreach($qns_id_result as $qns_id){
			$query = "SELECT * FROM Questions WHERE id=".$qns_id["question_id"];
			$result = $db->query($query);
			$qns_result =  mysqli_fetch_assoc($result);
			$qns_array[] = array(
				'id'=>$qns_result['id'],
				'user_id'=>$qns_result['user_id'],
				'title'=>$qns_result['title'],
				'content'=>$qns_result['content'],
				'score'=>(int)$qns_result['score'],
				'view_count'=>(int)$qns_result['view_count'],
				'created_at'=>$qns_result['created_at'],
				'updated_at'=>$qns_result['updated_at']
			);
		}	
		
		echo json_encode($qns_array);
	}

	/*
		Add new tag to 'Tags' table
		@param: tag_string
	*/
	if($cmd == "add_tag"){
		//$tag_string =  $db->escape_string($data->tag_string);
		
		//$tag_array = explode(",", $tag_string);
		$tag_array = json_decode($data->tag_string);
		add_tag($tag_array);
	}	

	/*
		Add new tags to a questions
		@param: qns_id, tag_string
	*/
	if($cmd == "tag_qns"){
		$qns_id = $db->escape_string($data->qns_id);
		//$tag_string =  $db->escape_string($data->tag_string);
		
		$tag_array = json_decode($data->tag_string);//explode(",", $tag_string);
		add_tag($tag_array);
		
		tag_qns($qns_id, $tag_array);

		if(count($tag_array) > 0){
			echo json_encode(true);
		}else{
			echo json_encode(false);
		}
	}

	/*
		Delete tags associated with a questions
		@param: qns_id, tag_string
	*/
	if($cmd == "delete_tag"){
		global $db;

		$qns_id = $db->escape_string($data->qns_id);
		//$tag_string =  $db->escape_string($data->tag_string);
		$tag_array = json_decode($data->tag_string);

		$affected=0;
		
		if(!empty($tag_array)){
		//if(!empty($tag_string)){
			//$tag_array = explode(",", $tag_string);

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
				$affected += $db->affected_rows;
			}
			
		}

		if( $affected > 0 ){
			echo json_encode(true);
		}else{
			echo json_encode(false);
		}		
	}
	
	

?>
