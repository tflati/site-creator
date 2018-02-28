app.directive("myVennElement", function() { 
	return { 
		restrict: "E", 
		scope: { 
			myElement: "=" 
		},
		controller :function MyWordCloudElementController($scope, $http, variableList) {
			
			$scope.filter_list = [];
						
			if(!$scope.myElement.demo){
								
				$scope.$watch(function() { return variableList.getVariableList($scope.myElement.source); }, function(newValue, oldValue) { 
					
					//resolve the variable inside the original url
					$scope.source = variableList.resolveVariable($scope.myElement.source);
					
					//reload the venn diagram
					$http.get($scope.source).then(function(response) {
						if(createSet(response.data)) //create the sets obj
						{
							loadVenn($scope.sets_list); //use the sets obj for create the venn
						}
											
					}, function(response){
						
						$scope.error = 'Error while loading the data';
					});
					
				}, true);
				
			}
			else{
				$scope.source = "script/demo_venn/demo2.php";
				
				$http.get($scope.source).then(function(response) {
				
					if(createSet(response.data)) //create the sets obj
					{
						loadVenn($scope.sets_list); //use the sets obj for create the venn
					}
										
				}, function(response){
					
					$scope.error = 'Error while loading the data';
				});
			}
			
			function createSet(response){ 	//function for create the set list
				
				$scope.sets_list = [];
				$scope.info =  response;
				
				//find the venn field
				var field = [];
				var sets_info = "";
				
				if($scope.filter_list.length == 0){ //create the filter only the first time
					for(var i = 0; i < $scope.info.structure.field_list.length; i++){
						if($scope.info.structure.field_list[i].venn){
							field.push($scope.info.structure.field_list[i].label); //find the fields that contains the venn set name and zize
						}
						
						if($scope.info.structure.field_list[i].venn_info){
							sets_info = $scope.info.structure.field_list[i].label; //find the field that contains the venn information
						}
						
						//create filter list
						if($scope.info.structure.field_list[i].filters.list.length){ 	
							$scope.filter_list.push(
								{
									"label":$scope.info.structure.field_list[i].label, 
									"title":$scope.info.structure.field_list[i].filters.title,
									"filters":$scope.info.structure.field_list[i].filters.list
								}
							);
						}
					}
				} else {
					for(var i = 0; i < $scope.info.structure.field_list.length; i++){
						if($scope.info.structure.field_list[i].venn){
							field.push($scope.info.structure.field_list[i].label); //find the fields that containis the venn set name and zize
						}
						
						if($scope.info.structure.field_list[i].venn_info){
							sets_info = $scope.info.structure.field_list[i].label; //find the field that contains the venn information
						}
					}
				}
				
				if(field.length > 2){
					$scope.error = 'Incompatible data for venn diagram';	//the venn diagram want only two field the set name e the number of set
				}	
				else{
					//populate the set object
					var flag = true;
					
					for(var i = 0; i < $scope.info.hits.length; i++){
						
						var set = {"sets": [], "size": "", "info":""};
						
						for(var j = 0; j < field.length; j++){	
						
							var f = field[j];
							
							//check the type
							if($scope.info.hits[i][f][0].type == 'text'){
								set.sets = $scope.info.hits[i][f][0].label.split(","); //set name
							}
							else if($scope.info.hits[i][f][0].type == 'number'){
								set.size = $scope.info.hits[i][f][0].value;	//set size
							} 
							else {
								flag = false;
							}								
						}
						
						set.info = $scope.info.hits[i][sets_info][0].label; //set info
						
						$scope.sets_list.push(set); //push the set info in the set list
					}
					
					if(!flag){
						$scope.error = 'Incompatible data for venn diagram';
					}
					else{
						//Success
						return true
					}					
				}
			}
			

			function loadVenn(sets) {	//function for load the venn diagram
				// draw venn diagram
				var div = d3.select("#venn")
				div.datum(sets).call(venn.VennDiagram());

				// add a tooltip
				var tooltip = d3.select("#venn_info");
				
				// add listeners to all the groups to display tooltip on mouseover
				div.selectAll("g")
					.on("mouseover", function(d, i) {
						// sort all the areas relative to the current item
						venn.sortAreas(div, d);

						// Display a tooltip with the current size
						tooltip.transition().duration(400).style("opacity", .9);
						tooltip.text(d.info);
						
						// highlight the current path
						var selection = d3.select(this).transition("tooltip").duration(400);
						selection.select("path")
							.style("stroke-width", 3)
							.style("fill-opacity", d.sets.length == 1 ? .4 : .1)
							.style("stroke-opacity", 1);
					})

					.on("mousemove", function() {
						tooltip.style("left", (d3.event.pageX) + "px")
							   .style("top", (d3.event.pageY - 28) + "px");
					})
					
					.on("mouseout", function(d, i) {
						tooltip.transition().duration(400).style("opacity", 0);
						var selection = d3.select(this).transition("tooltip").duration(400);
						selection.select("path")
							.style("stroke-width", 0)
							.style("fill-opacity", d.sets.length == 1 ? .25 : .0)
							.style("stroke-opacity", 0);
					})
					
					.on("click", function() {alert("cliccato");});
			}
			
			//fieldset filter function
			$scope.toggle = function (item, list) {
				var idx = list.indexOf(item);
				if (idx > -1) {
					list.splice(idx, 1);
				}
				else {
					list.push(item);
				}
			};

			$scope.exists = function (item, list) {
				return list.indexOf(item) > -1;
			};
			
			//functuion for applay the filter
			$scope.applyFilter = function () {	
				//$scope.requestAjax();				
				$http({
					method  : 'POST',
					url     : $scope.source,
					data    : {'filter' : $scope.filter_list},
					headers : {'Content-Type': 'application/x-www-form-urlencoded'} 
				})
				.success(function(data) {
					if(data != "KO")
					{
						if(createSet(data)) //update the sets obj
						{
							loadVenn($scope.sets_list);
							$scope.error = "";
						}
					} else {
						$scope.error = 'You must select at least one set.';	
					}
				})
				.
				error(function() {
					$scope.error = 'Error while loading the data';	
				});
			};
			
		},
		templateUrl: "engine/engine_components/venn/myVennElement.html"			
	}; 
});