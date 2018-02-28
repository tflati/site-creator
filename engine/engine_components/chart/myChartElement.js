app.directive("myChartElement", function() { 
	return { 
		restrict: "E", 
		scope: { 
			myElement: "=" 
		},
		controller :function MyChartElementController($scope, $http, variableList) {
			
			$scope.data = [];		
			$scope.labels = [];		
			$scope.series = [];		
			$scope.options = {};		
			$scope.datasetOverride = {};
			$scope.xAxes = "";
			$scope.yAxes = "";
			$scope.source = "";
			
			if(!$scope.myElement.demo){
				
				//create onwatch on the variables inside url
				$scope.$watch(function() { return variableList.getVariableList($scope.myElement.source); }, function(newValue, oldValue) { 
					
					//resolve the variable inside the original url
					$scope.source = variableList.resolveVariable($scope.myElement.source);
					
					//reload the source
					loadChart($scope.source);
				}, true);

			}
			else{
				//da cambiare in base al tipo di chart
				if($scope.myElement.chart_type == "doughnut_chart" || $scope.myElement.chart_type == "pie_chart" || $scope.myElement.chart_type == "polar_area_chart" ){
					$scope.source = "script/demo_chart/demo1.json";
				}
				
				if($scope.myElement.chart_type == "radar_chart" || $scope.myElement.chart_type == "bar_chart" || $scope.myElement.chart_type == "horizontal_bar_chart"){
					$scope.source = "script/demo_chart/demo2.json";
				}
				
				if($scope.myElement.chart_type == "line_chart"){
					$scope.source = "script/demo_chart/demo3.json";
				}
				
				loadChart($scope.source);
			}
			
			
			
			
			function loadChart(url){
				$http.get(url).then(function(response) {
					
					//delete the old data
					$scope.data = [];		
					$scope.labels = [];		
					$scope.series = [];		
					$scope.options = {};		
					$scope.datasetOverride = {};
					
					
					$scope.info = response.data;				
					var flag = true;
					
					$scope.field = [];	
						
					//find the fields
					for(var i = 0; i < $scope.info.structure.field_list.length; i++){
						if($scope.info.structure.field_list[i].chart){
							$scope.field.push($scope.info.structure.field_list[i].label);
						}
					}

					//inizialite the chart
					if($scope.myElement.chart_type == "doughnut_chart" || $scope.myElement.chart_type == "pie_chart" || $scope.myElement.chart_type == "polar_area_chart"){
						
						//populate label and data
						for(var i = 0; i < $scope.info.hits.length; i++){
							for(var j = 0; j < $scope.field.length; j++){
								
								var f = $scope.field[j];
								
								//check the type
								if($scope.info.hits[i][f][0].type == 'text'){
									$scope.labels.push($scope.info.hits[i][f][0].label);
								}
								else if($scope.info.hits[i][f][0].type == 'number'){
									$scope.data.push($scope.info.hits[i][f][0].value);
								} 
								else {
									flag = false;
								}							
							}
						}	

						$scope.legend_display = false;
					}
					
					if($scope.myElement.chart_type == "radar_chart" || $scope.myElement.chart_type == "bar_chart" || $scope.myElement.chart_type == "horizontal_bar_chart" || $scope.myElement.chart_type == "line_chart" ){
								
							
						if($scope.field.length >= 2){
							//series
							 
							for(i = 1; i < $scope.field.length; i++){
								$scope.series.push($scope.field[i]);
								
								$scope.data.push(new Array());	
							
							}
						}
						
						//populate label and data
						for(var i = 0; i < $scope.info.hits.length; i++){
							for(var j = 0; j < $scope.field.length; j++){
								
								var f = $scope.field[j];
								
								//check the type
								if($scope.info.hits[i][f][0].type == 'text'){
									$scope.labels.push($scope.info.hits[i][f][0].label);
								}
								else if($scope.info.hits[i][f][0].type == 'number'){
									
									if($scope.field.length >= 2){
										$scope.data[j-1].push($scope.info.hits[i][f][0].value);
									}
									else{
										$scope.data.push($scope.info.hits[i][f][0].value);
									}
								} 
								else {
									flag = false;
								}							
							}
						}
						
						//xAxes and yAxes
						if($scope.info.information != undefined) $scope.xAxes = $scope.info.information.x_axes.label;		
						if($scope.info.information != undefined) $scope.yAxes = $scope.info.information.y_axes.label;
						
								
						$scope.legend_display = true;
						
						/*$scope.datasetOverride = {
							"lineTension" : 0.3,
						};*/
					}
					
					
					$scope.options = {
						legend: { display: $scope.legend_display },
						tooltips: {
							callbacks: {
								title: function(tooltipItem, chartData) {
	   
								  var item = chartData.labels[tooltipItem[0].index];
								  
								  if(item.label) s = item.label;
								  else s = item;
								  
								  return s;
								},
								label: function(tooltipItem, chartData) {
									
									var l_i = tooltipItem.index;
									var d_i = tooltipItem.datasetIndex;
									 
									var key = chartData.labels[l_i];
									var value = chartData.datasets[d_i].data[l_i];
										  
									var finalString = key + ": " + value;
										  
									if($scope.myElement.chart_type == "pie_chart" || $scope.myElement.chart_type == "doughnut_chart"){
								
										var allData = chartData.datasets[d_i].data;
										var total = 0;
										for(var i in allData){
											total += parseFloat(allData[i]);
										}
										
										var fraction = (value / total) * 100;
										var percentage = fraction.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2, useGrouping:false})
								  
										finalString += " ("+percentage+"%)";
									}                                  
									
									return finalString;
										
								}
							}
						}
					};
					
					
					if($scope.myElement.chart_type != "pie_chart" && $scope.myElement.chart_type != "doughnut_chart" && $scope.myElement.chart_type != "polar_area_chart"){
					   
						$scope.options.scales = {
							xAxes: [{
								stacked: $scope.myElement.chart_type == "bar_chart" && $scope.myElement.stacked != undefined && $scope.myElement.stacked == true ? true : false,
								scaleLabel: {
									display: true,
									labelString: $scope.xAxes
								}
							}],
							yAxes: [{
								stacked: $scope.myElement.chart_type == "bar_chart" && $scope.myElement.stacked != undefined && $scope.myElement.stacked == true ? true : false,
								scaleLabel: {
									display: true,
									labelString: $scope.yAxes
								}
							}]
						}
					}
					
					//check operation
					if(!flag){
						$scope.data = [];		
						$scope.labels = [];	
						$scope.error = 'Incompatible data for chart';
					}		
					
				}, function(response){
					
					$scope.error = 'Error while loading the data';
				});
			
			}
			
		},
		templateUrl: "engine/engine_components/chart/myChartElement.html"			
	}; 
});