app.service("variableList", function() { 
	
	this.v_obj ={
		open_tag : "{",
		close_tag : "}",
		variables_list : []
	};
	
	this.initialize = function(open_tag, close_tag, variables_list) { 
		this.v_obj.open_tag = open_tag;
		this.v_obj.close_tag = close_tag;
		this.v_obj.variables_list = variables_list;
	}; 
	
	this.getVObj = function() { 
		return this.v_obj;
	}; 
	
	this.add = function(variable) { 
		if(!search(this.v_obj.variables_list, variable)){
			this.v_obj.variables_list.push({"key" : variable, "default_value" : ""}); 
		}
	}; 
	
	this.updateValue = function(variable_key, new_value) { 
		for(var i = 0; i < this.v_obj.variables_list.length; i++) {
			if(variable_key == this.v_obj.variables_list[i].key){
				this.v_obj.variables_list[i].default_value = new_value;
			}
		}
	}; 
	
	function search(list, variable){
		for(var i = 0; i < list.length; i++) {
			if (list[i].key == variable) {
				return true;
			}
		}
		return false;
	};
	
	function removeDuplicates(originalArray, objKey) {
		var trimmedArray = [];
		var values = [];
		var value;

		for(var i = 0; i < originalArray.length; i++) {
			value = originalArray[i][objKey];

			if(values.indexOf(value) === -1) {
				trimmedArray.push(originalArray[i]);
				values.push(value);
			}
		}
		
		return trimmedArray;
	};
	
	this.check = function(url){
		var new_variables = [];
	
		if(url != undefined)
		{
			//create regex for identify the variable inside the url
			var reg = "\\" + this.v_obj.open_tag + "(.*?)\\" + this.v_obj.close_tag; 
			var pattern = new RegExp(reg, 'ig');
			var match = url.match(pattern);
			
			//loop on regex's match if there are some matches
			if(match != null){	
				for(i = 0; i < match.length; i++){
					var m = match[i].substring(1, match[i].length - 1);						
					if(!search(this.v_obj.variables_list, m)){
						new_variables.push({"name" : m});		
					}
				}	
			}
		}
		
		//delete duplicate
		return new_variables = removeDuplicates(new_variables, "name");
	}
	
	
	this.resolveVariable = function(url) {  //fuction for resolve the variable inside the url
		var result = url;
		
		var reg = "\\" + this.v_obj.open_tag + "(.*?)\\" + this.v_obj.close_tag; 
		var pattern = new RegExp(reg, 'ig');
		var match = url.match(pattern);
		
		//loop on regex's match if there are some matches
		if(match != null){	
			for(i = 0; i < match.length; i++){
				var m = match[i].substring(1, match[i].length - 1);						
				
				result = result.replace(this.v_obj.open_tag + m + this.v_obj.close_tag,  getVariableValue(this.v_obj.variables_list, m));
			}	
		}
		
		return result;
	}; 
	
	this.getVariableList = function(url) { //return all the variable in the list (no duplicates)
		var result = [];
		
		var reg = "\\" + this.v_obj.open_tag + "(.*?)\\" + this.v_obj.close_tag; 
		var pattern = new RegExp(reg, 'ig');
		var match = url.match(pattern);
		
		//loop on regex's match if there are some matches
		if(match != null){	
			for(i = 0; i < match.length; i++){
				var m = match[i].substring(1, match[i].length - 1);	
				
				//get the value of the m variable
				var value = getVariableValue(this.v_obj.variables_list, m);
				
				//push key value pair in the result array
				result.push({"key" : m, "default_value" : value}); 
			}
		}
		
		//delete duplicate
		return result = removeDuplicates(result, "key");
	}
	
	function getVariableValue(list, variable){
		for(var i = 0; i < list.length; i++) {
			if (list[i].key == variable) {
				return list[i].default_value;
			}
		}
	};
	
	
});