<?php
	//Get posted data and decodeing json
	$file_id = json_decode(file_get_contents('php://input'), true);
	
	//Get the file list
	$inp = file_get_contents('../json/file_list.json');
	$tempArray = json_decode($inp);
	
	//Search record in file list
	$info =array();
	
	foreach($tempArray as $key => $entry){
		if($entry->file_id == $file_id)
		{
			$info['filename'] = $entry->filename;
			$info['creation_date'] = $entry->creation_date;
			$info['modify_date'] = $entry->modify_date;
			$info['owner'] = $entry->owner;
		}
	}
	
	echo json_encode($info);
	
	/*
	//Close the file_list.json
	$jsonData = json_encode($tempArray, JSON_PRETTY_PRINT);
	if(file_put_contents('../json/file_list.json', $jsonData))
	{
		echo json_encode($info);
	}
	else
	{
		echo "KO";
	}*/
?>