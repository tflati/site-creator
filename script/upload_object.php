<?php
	//script for uploading file (image for now) on server
	print_r($_FILES); //for show all the file's information
	$filename = $_FILES['file']['name'];
	$destination = $_POST['targetPath']. $filename;
	move_uploaded_file($_FILES['file']['tmp_name'], $destination);
?>