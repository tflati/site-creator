<?php
	/*script for read demo table*/
	require_once('../inc/config.php');
	$info = json_decode(file_get_contents('php://input'), true);
	
	$order_field = $info['sort']['field'];
	$limit = $info['limit'];
	$offset = $info['offset'];
	$filter_list = $info['filter'];
	$use_pagination = $info['use_pagination'];
	
	//create query filter
	$filter = "1=1";

	for($i = 0; $i < count($filter_list); $i++) {
		$filter .= " AND (";
		$fil = "";
		for($j = 0; $j < count($filter_list[$i]['filters']); $j++) {
			
			if($filter_list[$i]['filters'][$j]['key'] == "age")
			{
				if($filter_list[$i]['filters'][$j]['chosen_value1'] != "" AND $filter_list[$i]['filters'][$j]['chosen_value2'] != "")
				{
					$fil .= " (".$filter_list[$i]['filters'][$j]['chosen_value1']." ".$filter_list[$i]['filters'][$j]['operators1']." ".$filter_list[$i]['filters'][$j]['key'].") AND (".$filter_list[$i]['filters'][$j]['key']." ".$filter_list[$i]['filters'][$j]['operators2']." ".$filter_list[$i]['filters'][$j]['chosen_value2'].")";
				}
				
			}
			else if($filter_list[$i]['filters'][$j]['key'] == "employee")
			{
				if($filter_list[$i]['filters'][$j]['chosen_value'])
				{
					$fil.= "1=1";
				}
				else
				{
					$fil.="employee = 0";
				}
			}
			else
			{	
				if($filter_list[$i]['filters'][$j]['chosen_value'] != "")
				{
					if($fil != "") $fil.=" OR ";
					$fil .= $filter_list[$i]['filters'][$j]['key']." ".$filter_list[$i]['filters'][$j]['operators']." '".$filter_list[$i]['filters'][$j]['chosen_value']."'";
				}
			}
		}
		
		if($fil == "") $fil = "1=1";
		
		$filter .= $fil;
		$filter .= ")";
	}
	
	
	//select column name
	$structure = new stdClass();
	$field_list = array();
	
	$stmt0 = $conn->prepare("SHOW COLUMNS FROM user");
	$stmt0->execute();
	while($row0 = $stmt0->fetch(PDO::FETCH_ASSOC)){
		
		if($row0['Key'] != "PRI")
		{
			$filters = array();		
			
			$field = array();
			$field['label'] = $row0['Field'];		
			$field['header'] = ucfirst($row0['Field']);		
			$field['tooltip'] = $row0['Field'];		
			
			//filtri
			
			if($row0['Field'] == "name")
			{	
				$title = array();
				$filters['title'] = 'Chose a name:';
				
				$lista = array();
				$fil = array();
				$fil['type'] = 'text';
				$fil['key'] = 'name';
				$fil['title'] = 'Insert a name:';
				$fil['operators'] = 'LIKE';
				$fil['chosen_value'] = '';
				array_push($lista,$fil);	
				
				$filters['list'] = $lista;
			}
			else if($row0['Field'] == "gender")
			{
				$filters['title'] = 'Chose a gender:';
				
				$lista = array();
				$fil = array();
				$fil['type'] = 'radio';
				$fil['key'] = 'gender';
				$fil['values'] = ['M','F'];
				$fil['operators'] = '=';
				$fil['chosen_value'] = '';
				array_push($lista,$fil);	
				
				$filters['list'] = $lista;
			}
			else if($row0['Field'] == "work")
			{
				$title = array();
				$filters['title'] = 'Chose a work:';
				
				$lista = array();
				$fil = array();
				$fil['type'] = 'select';
				$fil['key'] = 'work';
				$fil['multiple'] = false;
				$fil['values'] = ['researcher','student','teacher'];
				$fil['operators'] = 'LIKE';
				$fil['chosen_value'] = '';
				array_push($lista,$fil);
				
				/*$lista = array();
				$fil = array();
				$fil['type'] = 'fieldset';
				$fil['key'] = 'work';
				$fil['values'] = ['researcher','student','teacher'];
				$fil['operators'] = '=';
				$fil['chosen_value'] = array();
				array_push($lista,$fil);*/
				
				/*$lista = array();
				$fil = array();
				$fil['type'] = 'checkbox';
				$fil['key'] = 'work';
				$fil['message'] = 'Include teacher';
				$fil['chosen_value'] = true;
				array_push($lista,$fil);+/
				
				/*$fil = array();
				$fil['type'] = 'autocomplete';
				$fil['key'] = 'work';
				$fil['placeholder'] = 'Chose a work';
				$fil['values'] = ['researcher','student','teacher'];
				$fil['operators'] = 'LIKE';
				$fil['chosen_value'] = '';
				array_push($lista,$fil);	*/
				
				$filters['list'] = $lista;	
			}
			else if($row0['Field'] == "rating")
			{
				$title = array();
				$filters['title'] = 'Rating:';
				
				$lista = array();
				$fil = array();
				$fil['type'] = 'number';
				$fil['key'] = 'rating';
				$fil['operators'] = '=';
				$fil['min'] = '1';
				$fil['max'] = '100';
				$fil['step'] = '1';
				$fil['chosen_value'] = '';
				array_push($lista,$fil);
				
				$filters['list'] = $lista;	
			}
			else if($row0['Field'] == "age")
			{
				$title = array();
				$filters['title'] = 'Age:';
				
				$lista = array();
				$fil = array();
				$fil['type'] = 'number_range';
				$fil['key'] = 'age';
				$fil['operators1'] = '<=';
				$fil['min1'] = '1';
				$fil['max1'] = '100';
				$fil['step1'] = '1';
				$fil['chosen_value1'] = '';
				$fil['text'] = 'age';
				$fil['operators2'] = '<=';
				$fil['min2'] = '1';
				$fil['max2'] = '100';
				$fil['step2'] = '1';
				$fil['chosen_value2'] = '';
				array_push($lista,$fil);
				$filters['list'] = $lista;	
				
			}
			else if($row0['Field'] == "employee")
			{
				
				$lista = array();
				$fil = array();
				$fil['type'] = 'checkbox';
				$fil['key'] = 'employee';
				$fil['message'] = 'Include employee';
				$fil['chosen_value'] = true;
				array_push($lista,$fil);
				
				$filters['list'] = $lista;	
			}
			else
			{
				$filters = array();
				$filters['title'] = '';
				$filters['list'] = [];
			}
			
			$field['filters'] = $filters;
			
			array_push($field_list,$field);
			
		}
	}
		
	$field1 = array();
	$field1['header'] = "Button";
	$field1['label'] = "button";
	$field1['tooltip'] = "button";
	$field['type'] = "custom";
	$filters = array();
	$filters['title'] = '';
	$filters['list'] = [];
	$field1['filters'] = $filters;
	
	$field2 = array();
	$field2['header'] = "Image";
	$field2['label'] = "image";
	$field2['tooltip'] = "image";
	$filters2 = array();
	$filters['title'] = '';
	$filters['list'] = [];
	$field2['filters'] = $filters;
	
	array_push($field_list,$field1);
	array_push($field_list,$field2);
	
	@$structure->field_list = $field_list; 

	
	//count db record
	$sql0="SELECT COUNT(*) AS tot FROM user WHERE ".$filter;
	$stmt1 = $conn->prepare($sql0);
	$stmt1->execute();
	$row1 = $stmt1->fetch(PDO::FETCH_ASSOC);

	//bring record using limit and offset
	if($use_pagination)
	{
		$sql = "SELECT id, surname, name, gender, work, rating, age, IF(employee = 1,'SI','NO') AS is_employee  FROM user WHERE ".$filter." ORDER BY ".$order_field." ASC LIMIT ".$limit." OFFSET ".$offset;
	}
	else
	{
		$sql = "SELECT id, surname, name, gender, work, rating, age, IF(employee = 1,'SI','NO') AS is_employee  FROM user WHERE ".$filter." ORDER BY ".$order_field." ASC";
	}
	$stmt = $conn->prepare($sql);
	$stmt->execute();
	
	$record = array();
	while($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
		$hits = array();
				
		//NAME
		$text = array();
		$data = array();
		$data['type'] = 'text';
		$data['label'] = $row['name'];
		$data['color'] = 'black';
		$data['url'] = 'https://www.google.it';
		$data['target'] = '_blank';
	
		$pedix = array();
		$pedixd = array();
		$pedixd['type'] = 'text';
		$pedixd['label'] = 'pedix';
		$pedixd['color'] = 'red';
		$pedixd['url'] = '';
		$pedixd['target'] = '';
		$pedixd['pedix'] = array();
		array_push($pedix,$pedixd);
			
		$data['pedix'] = $pedix;
		
		array_push($text,$data);
		
		$hits['name'] = $text;
		/************************************/
		
		//SURNAME
		$text = array();
		$data = array();
		$data['type'] = 'text';
		$data['label'] = $row['surname'];
		$data['color'] = 'black';
		$data['url'] = '';
		$data['target'] = '';
		$data['pedix'] = array();
		array_push($text,$data);
		$hits['surname'] = $text;
		/************************************/
		
		//GENDER
		$text = array();
		$data = array();
		$data['type'] = 'text';
		$data['label'] = $row['gender'];
		if($row['gender'] == 'M')
		{
			$data['color'] = 'blue';
		}
		else
		{
			$data['color'] = '#E91E63';
		}
		$data['url'] = '';
		$data['target'] = '';
		$data['pedix'] = array();
		array_push($text,$data);
		$hits['gender'] = $text;
		/************************************/
		
		//WORK
		$text = array();
		$data = array();
		$data['type'] = 'text';
		$data['label'] = $row['work'];
		$data['color'] = 'black';
		$data['url'] = '';
		$data['target'] = '';
		$data['pedix'] = array();
		array_push($text,$data);
		$hits['work'] = $text;
		/************************************/
		
		//RATING
		$text = array();
		$data = array();
		$data['type'] = 'text';
		$data['label'] = $row['rating'];
		$data['color'] = 'black';
		$data['url'] = '';
		$data['blank'] = '';
		$data['pedix'] = array();
		array_push($text,$data);
		
		$data = array();
		$data['type'] = "icon";
		if($row['rating'] == 1)
		{
			$data['icon_color'] = "red";
		}
		else if ($row['rating'] == 2)
		{
			$data['icon_color'] = "orange";
		}
		else if ($row['rating'] == 3)
		{
			$data['icon_color'] = "green";
		}
		else if ($row['rating'] == 4)
		{
			$data['color'] = "blue";
		}
		$data['url'] = "";
		$data['target'] = "_blank";
		$data['icon_dim'] = "fa-2x";
		$data['icon'] = "fa-circle";
		$data['title'] = "Rating: ".$row['rating'];
		array_push($text,$data);
	
		$hits['rating'] = $text;		
		
		//AGE
		$text = array();
		$data = array();
		$data['type'] = 'number';
		$data['value'] = $row['age'];
		array_push($text,$data);
		$hits['age'] = $text;
		
		//EMPLOYEE
		$text = array();
		$data = array();
		$data['type'] = 'text';
		$data['label'] = $row['is_employee'];
		$data['color'] = 'black';
		$data['url'] = '';
		$data['blank'] = '';
		$data['pedix'] = array();
		array_push($text,$data);
		$hits['employee'] = $text;	
		
		/***********************************/
		
		//BUTTON
		$button = array();
		$data = array();
		$data['type'] = "button";
		$data['action'] = "";
		$data['color'] = "";
		$data['title'] = "Button example";
		$data['disabled'] = true;
		
		$item = array();
		$itemd = array();
		$itemd['type'] = 'text';
		$itemd['label'] = 'test';
		$itemd['color'] = 'white';
		$itemd['url'] = '';
		$itemd['target'] = '';
		$itemd['pedix'] = array();
		array_push($item,$itemd);
		
		
		$data['items'] = $item;
		
		array_push($button,$data);
		$hits['button'] = $button;
		/***********************************/
		
		
		//IMAGE
		$image = array();
		$data = array();
		$data['type'] = "image";
		$data['img_src'] = "engine/engine_components/table/img/cineca.jpg";
		$data['height'] = "42";
		$data['width'] = "42";
		$data['url'] = "https://www.cineca.it";
		$data['target'] = "_blank";
		$data['title'] = "Logo Cineca";
		$data['pedix'] = array();
		array_push($image,$data);
			
		$data = array();
		$data['type'] = "image";
		$data['img_src'] = "engine/engine_components/table/img/sapienza.png";
		$data['height'] = "42";
		$data['width'] = "42";
		$data['url'] = "http://www.uniroma1.it";
		$data['target'] = "_blank";
		$data['title'] = "Logo Università";
		$data['pedix'] = array();
		array_push($image,$data);
		
		$hits['image'] = $image;
		
		/**************************************/
		
		array_push($record,$hits); 
	}
		
	//object for the table
	$data = new stdClass();
	@$data->structure = $structure; 
	@$data->total = $row1['tot']; 
	@$data->hits = $record; 
	
	
	echo $json =  json_encode($data);
?>