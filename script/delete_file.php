<?php
	//Get posted data and decodeing json
	$file_id = json_decode(file_get_contents('php://input'), true);
	
	//Get the file list
	$inp = file_get_contents('../json/file_list.json');
	$tempArray = json_decode($inp);
	
	//Search record in file list
	$filename = "";
	$key_d = "";
	
	foreach($tempArray as $key => $entry){
		if($entry->file_id == $file_id)
		{
			$filename = $entry->filename;//file to delete
			$key_d= $key; //Record to delete
		}
	}
	
	//Delete file
	unlink("../file/".$filename.".json");
	
	//Delete record
	unset($tempArray[$key_d]);
	
	//Close the file_list.json
	$jsonData = json_encode($tempArray, JSON_PRETTY_PRINT);
	if(file_put_contents('../json/file_list.json', $jsonData))
	{
		echo "OK";
	}
	else
	{
		echo "KO";
	}
?>