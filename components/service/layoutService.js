app.service("layoutService", function() { 
	
	this.max_container_id = 0;
	this.max_element_id = 0;
		
	this.l_obj ={
		container_list : [],
		layout_list : {}
	};
	
	this.initialize = function(c_list, l_list, max_c_id, max_e_id) { 
		this.l_obj.container_list = c_list;
		this.l_obj.layout_list = l_list;
		this.max_container_id = max_c_id;
		this.max_element_id = max_e_id;
	}; 
	
	this.getContainerList = function() { 
		return this.l_obj.container_list;
	}; 
	
	this.getLayoutList = function() { 
		return this.l_obj.layout_list;
	}; 
	
	//container function
	this.addContainer = function(container_title, container_url) {
		this.max_container_id = this.max_container_id + 1;
		this.l_obj.container_list.push({"id" : this.max_container_id, "title" : container_title, "url" : container_url, "show_header" : "normal", "show_long_description" : true, "show_logos" : true, "elements" : []});
		this.l_obj.layout_list[this.max_container_id] = [];
	};
	
	this.deleteContainer = function(index) {
		delete this.l_obj.layout_list[this.l_obj.container_list[index].id];
		this.l_obj.container_list.splice(index, 1);
	};
	
	this.getContainerName = function(id_c) { 
		for(var i = 0; i < this.l_obj.container_list.length; i++){
			if(this.l_obj.container_list[i].id == id_c){
				return this.l_obj.container_list[i].title;
			}	
		}
	}; 
	
	//element function
	this.addElement = function(answer, container_id) {
		var index;
		
		//Search index of element with id = container_id
		for(var i = 0; i < this.l_obj.container_list.length; i++){
			if(this.l_obj.container_list[i].id == container_id){
				index = i;
			}
			
		}
		
		if(answer.chart){
			if(answer.chartN >=1 && answer.chartN <=5){
				for(i = 0; i < answer.chartN; i++){
					this.max_element_id = this.max_element_id + 1;
					
					//add element into container
					this.l_obj.container_list[index].elements.push({
						"id" : this.max_element_id, 
						"type" : "chart",
						"label" : "", 
						"description" : "", 
						"source" : "", 
						"chart_type" : "bar_chart",
						"stacked" : false,
						"height" : "",
						"width" : "",
						"demo" : false
					});
					
					//add element into layout
					this.l_obj.layout_list[container_id].push({"type": "item", "id": this.max_element_id}); //access dinamically to the property of a variable
				}
			}
		}
		
		if(answer.datatable){
			if(answer.datatableN >=1 && answer.datatableN <=5){
				for(i = 0; i < answer.datatableN; i++){
					this.max_element_id = this.max_element_id + 1;
					
					//add element into container
					this.l_obj.container_list[index].elements.push({
						"id" : this.max_element_id, 
						"type" : "datatable", 
						"label" : "", 
						"description" : "", 
						"source" : "",
						"use_header" : true,
						"use_pagination" : true,
						"row_page" : "5",
						"demo" : false					
					});
					
					//add element into layout
					this.l_obj.layout_list[container_id].push({"type": "item", "id": this.max_element_id}); //access dinamically to the property of a variable
				}
			}
		}
		
		if(answer.customForm){
			if(answer.customFormN >=1 && answer.customFormN <=5){
				for(i = 0; i < answer.customFormN; i++){
					this.max_element_id = this.max_element_id + 1;
					
					//add element into container
					this.l_obj.container_list[index].elements.push({
						"id" : this.max_element_id,
						"type" : "form", 
						"label" : "", 
						"key" : "", 
						"description" : "",
						"fields" : [],
						"submit" : {
							"label": "Submit",
							"url": ""
						}
					});
					
					//add element into layout
					this.l_obj.layout_list[container_id].push({"type": "item", "id": this.max_element_id}); //access dinamically to the property of a variable
				}
			}
		}
		
		if(answer.customImage){
			if(answer.customImageN >=1 && answer.customImageN <=5){							
				for(i = 0; i < answer.customImageN; i++){
					this.max_element_id = this.max_element_id + 1;
					
					//add element into container
					this.l_obj.container_list[index].elements.push({
						"id" : this.max_element_id, 
						"type" : "image", 
						"label" : "",
						"description" : "",
						"source" : "", 
						"image_position" : ""
					});
					
					//add element into layout
					this.l_obj.layout_list[container_id].push({"type": "item", "id": this.max_element_id}); //access dinamically to the property of a variable
				}
			}
		}	
		
		if(answer.customFrame){
			if(answer.customFrameN >=1 && answer.customFrameN <=5){
				for(i = 0; i < answer.customFrameN; i++){
					this.max_element_id = this.max_element_id + 1;
					
					//add element into container
					this.l_obj.container_list[index].elements.push({
						"id" : this.max_element_id,
						"type" : "iframe", 
						"label" : "",
						"description" : "",
						"source" : "",
						"width" : "",
						"height" : "",
						"options" : ""	
					});
					
					//add element into layout
					this.l_obj.layout_list[container_id].push({"type": "item", "id": this.max_element_id}); 
				}
			}
		}
		
		if(answer.customPTree){
			if(answer.customPTreeN >=1 && answer.customPTreeN <=5){
				for(i = 0; i < answer.customPTreeN; i++){
					this.max_element_id = this.max_element_id + 1;
					
					//add element into container
					this.l_obj.container_list[index].elements.push({
						"id" : this.max_element_id,
						"type" : "ptree", 
						"label" : "",
						"description" : "",
						"source" : "",
						"radial" : false
					});
					
					//add element into layout
					this.l_obj.layout_list[container_id].push({"type": "item", "id": this.max_element_id}); 
				}
			}
		}
		
		if(answer.customBG){
			if(answer.customBGN >=1 && answer.customBGN <=5){
				for(i = 0; i < answer.customBGN; i++){
					this.max_element_id = this.max_element_id + 1;
					
					//add element into container
					this.l_obj.container_list[index].elements.push({
						"id" : this.max_element_id,
						"type" : "button_group", 
						"label" : "",
						"description" : "",
						"layout_g" : "row",
						"source" : "",
						"dynamic": false,
						"buttons" : []
					});
					
					//add element into layout
					this.l_obj.layout_list[container_id].push({"type": "item", "id": this.max_element_id}); 
				}
			}
		}
				
		if(answer.customText){
			if(answer.customTextN >=1 && answer.customTextN <=5){							
				for(i = 0; i < answer.customTextN; i++){
					this.max_element_id = this.max_element_id + 1;
					
					//add element into container
					this.l_obj.container_list[index].elements.push({
						"id" : this.max_element_id, 
						"type" : "text", 
						"label" : "",
						"description" : ""
					});
					
					//add element into layout
					this.l_obj.layout_list[container_id].push({"type": "item", "id": this.max_element_id}); //access dinamically to the property of a variable
				}
			}
		}	
		
		if(answer.customList){
			if(answer.customListN >=1 && answer.customListN <=5){							
				for(i = 0; i < answer.customListN; i++){
					this.max_element_id = this.max_element_id + 1;
					
					//add element into container
					this.l_obj.container_list[index].elements.push({
						"id" : this.max_element_id, 
						"type" : "customlist", 
						"label" : "",
						"description" : "",
						"dynamic" : false,
						"source" : "",
						"items" : []
					});
					
					//add element into layout
					this.l_obj.layout_list[container_id].push({"type": "item", "id": this.max_element_id}); //access dinamically to the property of a variable
				}
			}
		}	
		
		if(answer.customSlider){
			if(answer.customSliderN >=1 && answer.customSliderN <=5){							
				for(i = 0; i < answer.customSliderN; i++){
					this.max_element_id = this.max_element_id + 1;
					
					//add element into container
					this.l_obj.container_list[index].elements.push({
						"id" : this.max_element_id, 
						"type" : "slider", 
						"label" : "",
						"description" : "",
						"min_value" : "",
						"max_value" : "",
						"step_value" : "",
						"variable" : ""
					});
					
					//add element into layout
					this.l_obj.layout_list[container_id].push({"type": "item", "id": this.max_element_id}); //access dinamically to the property of a variable
				}
			}
		}	
		
		if(answer.customVenn){
			if(answer.customVennN >=1 && answer.customVennN <=5){							
				for(i = 0; i < answer.customVennN; i++){
					this.max_element_id = this.max_element_id + 1;
					
					//add element into container
					this.l_obj.container_list[index].elements.push({
						"id" : this.max_element_id, 
						"type" : "venn", 
						"label" : "",
						"description" : "",
						"source" : "",
						"demo" : false		
					});
					
					//add element into layout
					this.l_obj.layout_list[container_id].push({"type": "item", "id": this.max_element_id}); //access dinamically to the property of a variable
				}
			}
		}	
		
		if(answer.customWCloud){
			if(answer.customWCloudN >=1 && answer.customWCloudN <=5){							
				for(i = 0; i < answer.customWCloudN; i++){
					this.max_element_id = this.max_element_id + 1;
					
					//add element into container
					this.l_obj.container_list[index].elements.push({
						"id" : this.max_element_id, 
						"type" : "wordcloud", 
						"label" : "",
						"description" : "",
						"width": 400,
						"height": 400,
						"shape": "elliptic",
						"source" : "",
						"demo" : false		
					});
					
					//add element into layout
					this.l_obj.layout_list[container_id].push({"type": "item", "id": this.max_element_id}); //access dinamically to the property of a variable
				}
			}
		}	
	};
	
	this.deleteElement = function(container_id, element_index) {
		
		//ANDRà MODIFICATA 
		var element_id;
		
		for(var i = 0; i < this.l_obj.container_list.length; i++){ //find the element id
			if(this.l_obj.container_list[i].id == container_id){
				element_id = this.l_obj.container_list[i].elements[element_index].id; //save the element id 
				this.l_obj.container_list[i].elements.splice(element_index, 1); //delete the element from the container list
			}
		}
	
		for(var i = 0; i < this.l_obj.layout_list[container_id].length; i++){
			if(this.l_obj.layout_list[container_id][i].id == element_id){
				this.l_obj.layout_list[container_id].splice(i, 1);
			}
		}
		
	};
	
	this.getElementName = function(id_el) { 
		for(var i = 0; i < this.l_obj.container_list.length; i++){
			for(var j = 0; j < this.l_obj.container_list[i].elements.length; j++){
				if(this.l_obj.container_list[i].elements[j].id == id_el){
					return this.l_obj.container_list[i].elements[j].label + " (" + this.l_obj.container_list[i].elements[j].type + ")";
				}	
			}
		}
	}; 
	
	this.deleteGrid = function(id) {
		//delete this.l_obj.layout_list[this.l_obj.container_list[index].id];
		//this.l_obj.container_list.splice(index, 1);
		console.log(this.l_obj.layout_list);
	};
	
	this.getId = function(){
		this.max_element_id = this.max_element_id + 1;
		return this.max_element_id;
	};
	
}); 