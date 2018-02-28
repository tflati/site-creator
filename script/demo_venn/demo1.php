<?php
//FILTER
$info = json_decode(file_get_contents('php://input'), true);
$filter_list = $info['filter'];

if(isset($filter_list) AND count($filter_list) > 0)
{
	$a = false;
	$b = false;
	$c = false;
	
	for($i = 0; $i < count($filter_list); $i++) 
	{
		
		if($filter_list[$i]['label'] == "Set")
		{
			//field set
			$chosen_set = $filter_list[$i]['filters'][0]['chosen_value'];
			
			for($j = 0; $j < count($chosen_set); $j++){
				if($chosen_set[$j] == "A") $a = true;
				if($chosen_set[$j] == "B") $b = true;
				if($chosen_set[$j] == "C") $c = true;
			}
		}
		
		if($filter_list[$i]['label'] == "Size")
		{
			//number range
			$chosen_size1 = $filter_list[$i]['filters'][0]['chosen_value1'];
			$operator1 = $filter_list[$i]['filters'][0]['operators1'];
			$chosen_size2 = $filter_list[$i]['filters'][0]['chosen_value2'];
			$operator2 = $filter_list[$i]['filters'][0]['operators2'];
			
			if($chosen_size1 != "" AND $chosen_size2 != "" )
			{
				if($operator1 == "<" AND $operator2 == "<" )
				{
					if(($chosen_size1 < 12) AND (12 < $chosen_size2))  $a = true; //A size
					else $a = false;
					if(($chosen_size1 < 20) AND (20 < $chosen_size2))  $b = true; //B size
					else $b = false;
					if(($chosen_size1 < 8) AND (8 < $chosen_size2))  $c = true; //C size
					else $c = false;
				}
				else if ($operator1 == "<=" AND $operator2 == "<=" )
				{
					if(($chosen_size1 <= 12) AND (12 <= $chosen_size2))  $a = true; //A size
					else $a = false;
					if(($chosen_size1 <= 20) AND (20 <= $chosen_size2))  $b = true; //B size
					else $b = false;
					if(($chosen_size1 <= 8) AND (8 <= $chosen_size2))  $c = true; //C size
					else $c = false;
				}
				else if ($operator1 == "<" AND $operator2 == "<=" )
				{
					if(($chosen_size1 < 12) AND (12 <= $chosen_size2))  $a = true; //A size
					else $a = false;
					if(($chosen_size1 < 20) AND (20 <= $chosen_size2))  $b = true; //B size
					else $b = false;
					if(($chosen_size1 < 8) AND (8 <= $chosen_size2))  $c = true; //C size
					else $c = false;
				}
				else if ($operator1 == "<=" AND $operator2 == "<" )
				{
					if(($chosen_size1 <= 12) AND (12 < $chosen_size2))  $a = true; //A size
					else $a = false;
					if(($chosen_size1 <= 20) AND (20 < $chosen_size2))  $b = true; //B size
					else $b = false;
					if(($chosen_size1 <= 8) AND (8 < $chosen_size2))  $c = true; //C size
					else $c = false;
				}
			}
			/*
			//number
			$chosen_size = $filter_list[$i]['filters'][0]['chosen_value'];
			$operator = $filter_list[$i]['filters'][0]['operators'];
			
			if($chosen_size != "")
			{
				switch($operator){
					case "=":
						if($chosen_size == 12) $a = true; //A size
						else $a = false;
						if($chosen_size == 20) $b = true;	//B size
						else $b = false;
						if($chosen_size == 8) $c = true; //C size
						else $c = false;
						break;
					case "!=":
						if($chosen_size != 12) $a = true; //A size
						else $a = false;
						if($chosen_size != 20) $b = true;	//B size
						else $b = false;
						if($chosen_size != 8) $c = true; //C size
						else $c = false;
						break;
					case ">":
						if(12 > $chosen_size) $a = true; //A size
						else $a = false;
						if(20 > $chosen_size) $b = true;	//B size
						else $b = false;
						if(8 > $chosen_size) $c = true; //C size
						else $c = false;
						break;
					case ">=":
						if(12 >= $chosen_size) $a = true; //A size
						else $a = false;
						if(20 >= $chosen_size) $b = true;	//B size
						else $b = false;
						if(8 >= $chosen_size) $c = true; //C size
						else $c = false;
						break;
					case "=":
						if(12 <= $chosen_size) $a = true; //A size
						else $a = false;
						if(20 <= $chosen_size) $b = true;	//B size
						else $b = false;
						if(8 <= $chosen_size) $c = true; //C size
						else $c = false;
						break;
					case "<=":
						if(12 <= $chosen_size) $a = true; //A size
						else $a = false;
						if(20 <= $chosen_size) $b = true;	//B size
						else $b = false;
						if(8 <= $chosen_size) $c = true; //C size
						else $c = false;
						break;
				}
			}
			*/
		}
				
	}
}
else
{
	$a = true;
	$b = true;
	$c = true;
}


//STRUCTURE
$structure = new stdClass();
$field_list = array();

//SET field
$field = array();	
$field['label'] = "Set";		
$field['tooltip'] = "";
	
	$filters = array();	
	$filters['title'] = "Include the set:";
	$filters['list'] =[];
	$lista = array();
	$fil = array();
	$fil['type'] = 'fieldset';
	$fil['key'] = 'set';
	$fil['values'] = ['A','B','C'];
	$fil['operators'] = '=';
	$fil['chosen_value'] = ['A','B','C'];
	array_push($lista,$fil);
	$filters['list'] = $lista;
	
$field['filters'] = $filters;
$field['venn'] = true;
array_push($field_list,$field);

//Size field
$field = array();	
$field['label'] = "Size";		
$field['tooltip'] = "";

	$filters = array();	
	$filters['title'] = "Set size";
	$filters['label'] = "Size";
	$filters['list'] =[];
	
	/*
	//number
	$lista = array();
	$fil = array();
	$fil['type'] = 'number';
	$fil['key'] = 'size';
	$fil['operators'] = '=';
	$fil['min'] = '1';
	$fil['max'] = '100';
	$fil['step'] = '1';
	$fil['chosen_value'] = '';
	array_push($lista,$fil);
	$filters['list'] = $lista;	
	*/
	
	//number range
	$lista = array();
	$fil = array();
	$fil['type'] = 'number_range';
	$fil['key'] = 'size';
	$fil['operators1'] = '<=';
	$fil['min1'] = '1';
	$fil['max1'] = '100';
	$fil['step1'] = '1';
	$fil['chosen_value1'] = '';
	$fil['text'] = 'size';
	$fil['operators2'] = '<=';
	$fil['min2'] = '1';
	$fil['max2'] = '100';
	$fil['step2'] = '1';
	$fil['chosen_value2'] = '';
	array_push($lista,$fil);
	$filters['list'] = $lista;
	
$field['filters'] = $filters;
$field['venn'] = true;
/*$lista = array();
$fil = array();
$fil['type'] = 'text';
$fil['key'] = 'name';
$fil['title'] = 'Insert a name:';
$fil['operators'] = 'LIKE';
$fil['chosen_value'] = '';
array_push($lista,$fil);
$filters['list'] = $lista; */
array_push($field_list,$field);

//Size field
$field = array();	
$field['label'] = "Information";		
$field['tooltip'] = "";
	$filters = array();	
	$filters['title'] = "";
	$filters['list'] =[];
$field['filters'] = $filters;
$field['venn'] = false;
$field['venn_info'] = true;

/*$lista = array();
$fil = array();
$fil['type'] = 'text';
$fil['key'] = 'name';
$fil['title'] = 'Insert a name:';
$fil['operators'] = 'LIKE';
$fil['chosen_value'] = '';
array_push($lista,$fil);
$filters['list'] = $lista; */
array_push($field_list,$field);

@$structure->field_list = $field_list;


//HITS
$total = 0;
$record = array();

/*************** SET A ****************/
if($a)
{
	$hits = array();

	//name A
	$text = array();
	$data = array();
	$data['type'] = 'text';
	$data['label'] = "A";
	$data['color'] = 'black';
	$data['url'] = "";
	$data['target'] = "";
	$data['pedix'] = [];
	array_push($text,$data);
	$hits['Set'] = $text;

	//dim A
	$text = array();
	$data = array();
	$data['type'] = 'number';
	$data['value'] = "12";
	array_push($text,$data);
	$hits['Size'] = $text;

	//info A
	$text = array();
	$data = array();
	$data['type'] = 'text';
	$data['label'] = "This is information about set A. The number of element is 12";
	$data['color'] = 'black';
	$data['url'] = "";
	$data['target'] = "";
	$data['pedix'] = [];
	array_push($text,$data);
	$hits['Information'] = $text;

	array_push($record,$hits); 
	
	$total++;
}
/**************************************/


/*************** SET B ****************/
if($b)
{
	$hits = array();

	//name B
	$text = array();
	$data = array();
	$data['type'] = 'text';
	$data['label'] = "B";
	$data['color'] = 'black';
	$data['url'] = "";
	$data['target'] = "";
	$data['pedix'] = [];
	array_push($text,$data);
	$hits['Set'] = $text;

	//dim B
	$text = array();
	$data = array();
	$data['type'] = 'number';
	$data['value'] = "20";
	array_push($text,$data);
	$hits['Size'] = $text;

	//info B
	$text = array();
	$data = array();
	$data['type'] = 'text';
	$data['label'] = "This is information about set B. The number of element is 20";
	$data['color'] = 'black';
	$data['url'] = "";
	$data['target'] = "";
	$data['pedix'] = [];
	array_push($text,$data);
	$hits['Information'] = $text;

	array_push($record,$hits); 
	
	$total++;
}
/**************************************/


/*************** SET C ****************/
/*
if($c)
{
	$hits = array();

	//name C
	$text = array();
	$data = array();
	$data['type'] = 'text';
	$data['label'] = "C";
	array_push($text,$data);
	$hits['Set'] = $text;

	//dim C
	$text = array();
	$data = array();
	$data['type'] = 'number';
	$data['value'] = "8";
	array_push($text,$data);
	$hits['Size'] = $text;

	//info C
	$text = array();
	$data = array();
	$data['type'] = 'text';
	$data['label'] = "This is information about set C. The number of element is 8";
	$data['color'] = 'black';
	$data['url'] = "";
	$data['target'] = "";
	$data['pedix'] = [];
	array_push($text,$data);
	$hits['Information'] = $text;

	array_push($record,$hits); 
	
	$total++;
}*/
/**************************************/

/*************** SET AB ****************/
if($a AND $b)
{
	$hits = array();

	//name AB
	$text = array();
	$data = array();
	$data['type'] = 'text';
	$data['label'] = "A,B";
	$data['color'] = 'black';
	$data['url'] = "";
	$data['target'] = "";
	$data['pedix'] = [];
	array_push($text,$data);
	$hits['Set'] = $text;

	//dim AB
	$text = array();
	$data = array();
	$data['type'] = 'number';
	$data['value'] = "5";
	array_push($text,$data);
	$hits['Size'] = $text;

	//info AB
	$text = array();
	$data = array();
	$data['type'] = 'text';
	$data['label'] = "This is information about the intersection of set A and set B. The number of element is 5";
	$data['color'] = 'black';
	$data['url'] = "";
	$data['target'] = "";
	$data['pedix'] = [];
	array_push($text,$data);
	$hits['Information'] = $text;

	array_push($record,$hits); 
	
	$total++;
}
/**************************************/


/*************** SET BC ****************/
/*
if($b AND $c)
{
	$hits = array();

	//name BC
	$text = array();
	$data = array();
	$data['type'] = 'text';
	$data['label'] = "B,C";
	$data['color'] = 'black';
	$data['url'] = "";
	$data['target'] = "";
	$data['pedix'] = [];
	array_push($text,$data);
	$hits['Set'] = $text;

	//dim BC
	$text = array();
	$data = array();
	$data['type'] = 'number';
	$data['value'] = "2";
	array_push($text,$data);
	$hits['Size'] = $text;

	//info BC
	$text = array();
	$data = array();
	$data['type'] = 'text';
	$data['label'] = "This is information about the intersection of set B and set C. The number of element is 2";
	$data['color'] = 'black';
	$data['url'] = "";
	$data['target'] = "";
	$data['pedix'] = [];
	array_push($text,$data);
	$hits['Information'] = $text;

	array_push($record,$hits); 
	
	$total++;
}*/
/**************************************/

//object for the table
$data = new stdClass();
@$data->structure = $structure; 
@$data->total = $total; 
@$data->hits = $record; 

if($total != 0)
{
	echo $json =  json_encode($data);
}
else
{
	echo "KO";
}

?>