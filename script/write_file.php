<?php 
	//Get posted data and decodeing json
	$request = json_decode(file_get_contents('php://input'), true);
	$file = $request['file'];
	$file_id = $request['file_id'];
	$options = $request['options'];
	$filename = $options['filename'];
	$owner = $options['owner'];
	
// 	echo($filename);
	
	//Get the file list
	$inp = file_get_contents('../json/file_list.json');
	$tempArray = json_decode($inp);
	
	//Get current time
	date_default_timezone_set('Europe/Rome');
	$current_time = date("Y-m-d H:i");    
    
//     if ($file_id == "") echo ("EMPTY");
//     else echo("EXISTING: '".$file_id."'");
    
    //search record in file list
    $found = false;
    foreach($tempArray as $key => $entry){
        if($entry->file_id == $file_id)
        {
            $found = true;
            $old_file = $entry->filename;
            $entry->filename = $filename;
            $entry->modify_date = $current_time;
            $entry->user_name = $owner;
        }
    }
    
	if(!$found) //first save
	{
		//calculate new id
		if(count($tempArray) > 0)
		{
			$max_value = max($tempArray);
			$id = $max_value->file_id + 1;
		}
		else 
		{
			$id = 1;
		}
		
		//create and save new record
		$new_record = array();
		$new_record['file_id'] = (string)$id;
		$new_record['filename'] = $filename;
		$new_record['creation_date'] = $current_time;
		$new_record['modify_date'] = $current_time;
		$new_record['owner'] = $owner;
		array_push($tempArray, $new_record);
		
		$file_id = $id;
		
// 		echo($id);
// 		echo($file_id);
// 		echo($current_time);
	}
	else
	{
		$old_file = "";
		
		//delete the old file
		unlink("../file/".$old_file.".json");
		
// 		echo("OVERWRITING");
	}
	
	//close the file_list.json
	$jsonData = json_encode($tempArray, JSON_PRETTY_PRINT);
	
// 	echo($jsonData);
	
	file_put_contents('../json/file_list.json', $jsonData);
	
	if(count($file["layout"]["dropzones"]) == 0)
	{
		$file["layout"]["dropzones"] = (object) array();
	}
		
	//write the file json
	$json = json_encode($file, JSON_PRETTY_PRINT);	
	if(file_put_contents("../file/".$filename.".json", $json))
	{
		echo $file_id;
	}
	else 
	{
		echo "KO";
	}
?>