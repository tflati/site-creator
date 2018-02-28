<?php
	//Get posted data and decodeing json
	$values = json_decode(file_get_contents('php://input'), true);
	
	echo "Thank you for submit your data!";

?>