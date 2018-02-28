<?php
	//connect to demo DB
	
	$hostdb = 'localhost';
	$namedb = 'cineca';
	$userdb = 'cineca';
	$passdb = 'cineca';

	try{
		//Connect and create the PDO object
		$conn = new PDO("mysql:host=$hostdb; dbname=$namedb", $userdb, $passdb);
		$conn->exec("SET CHARACTER SET utf8");	// Sets encoding UTF-8
		$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION); //set error report
	}
		catch(PDOException $e) {
		echo $e->getMessage();
	}

?>