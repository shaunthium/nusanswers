<?php
	require_once ('connect.php');

	global $db;

	$request_data = file_get_contents("php://input");
  	$data = json_decode($request_data);
  	$cmd = $db->escape_string($data->cmd);

	/*
		Get all qnestion and tags,
		Return qns_id, title and tags of a questions
	*/
	if($cmd == "get_all_qns_tags"){
		$query = "SELECT id, title FROM Questions";
		$result = $db->query($query);

		$qns_array = array();
		while($qns = mysqli_fetch_assoc($result)){

			$query_tag_id = "SELECT tag_id FROM Questions_Tags WHERE question_id=" . $qns['id'];
			$result_tag_id = $db->query($query_tag_id);

			$tag_name_array = array();
			while ($row = mysqli_fetch_assoc($result_tag_id)){
				$query_tag_name = "SELECT content FROM Tags WHERE id=" . $row['tag_id'];
				$result_tag_name = $db->query($query_tag_name);
				$tag = mysqli_fetch_assoc($result_tag_name);
				$tag_name_array[]  = $tag["content"];
			}

			$qns_array[] = array(
				'id' => $qns['id'],
				'title' => $qns['title'],
				'tags' => $tag_name_array
			);
		}


		echo json_encode($qns_array);
	}
	/*
		Get and return all questions associated with a tag
		@param: tag_string
	*/
		/*
	if($cmd == "search_qns_by_tags"){
		$tag_string = $db->escape_string($_POST["tag_string"]);
		$tag_array = explode(",", $tag_string);

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
				'qns_id'=>$qns_result['id'],
				'title'=>$qns_result['title']
				//'user_id'=>$qns_result['user_id'],
				//'content'=>$qns_result['content'],
				//'score'=>$qns_result['score'],
				//'view_count'=>$qns_result['view_count'],
				//'created_at'=>$qns_result['created_at'],
				//'updated_at'=>$qns_result['updated_at']
			);
		}

		echo json_encode($qns_array);
	}
	*/
?>
