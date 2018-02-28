// File Table dierctive
app.directive("myTableElement", function() { 
	return { 
		templateUrl: "engine/engine_components/table/myTableElement.html",
		restrict: "E", 
		scope: {
			myElement: "="
		},
		controller :function MyDataTableElementController($scope, $timeout, $http, variableList) {
			
			$scope.source = "";
			
			if(!$scope.myElement.demo){
				$scope.source = variableList.resolveVariable($scope.myElement.source);	
			}
			else{
				$scope.source = "script/demo_table/read.php";
			}
			
			$scope.isFilter = false;
			$scope.filter_visibility = false;
			
			$scope.showFilter = function (){
				if($scope.filter_visibility){
					$scope.filter_visibility = false;
				}
				else{
					$scope.filter_visibility = true;
				}
			}
			
			$scope.t_property = {
				'column-keys': []
			};
			
			$scope.t_id = {};
			$scope.filter_list = [];
			$scope.page_size = $scope.myElement.row_page;
			$scope.useHeader = $scope.myElement.use_header;
			$scope.usePagination = $scope.myElement.use_pagination;
			$scope.rowList = checkList($scope.page_size);

			$scope.paginatorCallback = function (page, pageSize, options){
				
				if($scope.t_property['column-keys'].length == 0 && pageSize != $scope.page_size){
					pageSize = $scope.page_size;
				}
			
				//aggiorno lista pagine
				
				
				if(!page) page = 1;
				var offset = (page-1) * pageSize;
				return $http.post($scope.source, {
						'use_pagination': $scope.usePagination,
						'offset': offset,
						'limit': pageSize,
						'sort':{
							'field':'id',
							'order':'ASC'
						},
						'filter':$scope.filter_list
					}).then(function(result){
			
						//set row table property
						if($scope.t_property['column-keys'].length == 0){
											
							for(var i = 0; i < result.data.structure.field_list.length; i++){
								//set column array
								$scope.t_property['column-keys'].push(result.data.structure.field_list[i].label);
								
								//set filter array
								if(result.data.structure.field_list[i].filters.list.length){
									$scope.filter_list.push(
										{
											"label":result.data.structure.field_list[i].label, 
											"title":result.data.structure.field_list[i].filters.title,
											"filters":result.data.structure.field_list[i].filters.list
										}
									);
								}
							}
							
							$scope.t_column= result.data.structure.field_list;
						}
						
						$scope.table_data = result.data;
												
						return {
							results: result.data.hits,
							totalResultCount: result.data.total
						}
					});
			};
						
			$scope.getLoadResultsCallback =  function (loadPageCallback){
				$scope.requestAjax = loadPageCallback;
			};
				
			$scope.applyFilter = function () {	
				$scope.requestAjax();
			};
					
			$scope.resetFilter = function () {
				for(var i = 0; i < $scope.filter_list.length; i++){
					for(var j = 0; j < $scope.filter_list[i].filters.length; j++){
						switch($scope.filter_list[i].filters[j].type){
							case "number_range":
								$scope.filter_list[i].filters[j].chosen_value1 = "";
								$scope.filter_list[i].filters[j].operators1 = "<=";
								$scope.filter_list[i].filters[j].chosen_value2 = "";
								$scope.filter_list[i].filters[j].operators2 = "<=";
								break;
							case "select":
								if($scope.filter_list[i].filters[j].multiple){
									$scope.filter_list[i].filters[j].chosen_value = [];
								}
								else{
									$scope.filter_list[i].filters[j].chosen_value = "";
								}
								break;
							case "checkbox":
								$scope.filter_list[i].filters[j].chosen_value = true;
								break;
							case "fieldset":
								$scope.filter_list[i].filters[j].chosen_value = [];
								break;
							default:
								$scope.filter_list[i].filters[j].chosen_value = "";
								break;
						}
					}
				}
			};
			
			$scope.formatFilterLabel = function (label){
				return label.charAt(0).toUpperCase() + label.slice(1);
			}

			function checkList(page) {
				var rowList = [5, 10, 20, 50, 100, 200, 500];
				for(var i = 0; i < rowList.length; i++){
					if(rowList[i] == page){
						var c_element = rowList.splice(i, 1);
						rowList.splice(0, 0, c_element[0]);
					}
				}
				return rowList;				
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
			
		}
	}; 
});

