<?php
	require_once('../inc/config.php');
	
	$user_id = json_decode(file_get_contents("php://input"));
	
	$stmt = $conn->prepare("SELECT file.id AS file_id, file_name, user_id, creation_date, modify_date, CONCAT(surname,' ',name) AS user_name FROM (file INNER JOIN user ON user_id = user.id) WHERE user_id=:user_id ORDER BY creation_date DESC");
	$stmt->execute(['user_id' => $user_id]);
	
	$files = array();
	
	while($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
		$file = array();
		$file['file_id'] = $row['file_id'];
		$file['file_name'] = $row['file_name'];
		$file['user_id'] = $row['user_id'];
		$file['creation_date'] = $row['creation_date'];
		$file['modify_date'] = $row['modify_date'];
		$file['user_name'] = $row['user_name'];
		array_push($files,$file); 
	}
	
	echo $json =  json_encode($files);
?>