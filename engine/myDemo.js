//ENGINE 
app.directive("myDemo", function() { 
	return { 
		restrict: "E", 
		scope: { 
			fileName: "="
		},
		controller :function MyContainerController($scope, $http, $mdSidenav, $window,  toaster, messageService, variableList) {
			
			$scope.load_error = false;
			$scope.load_error_text = "";
			$scope.toggleLeft = buildToggler('leftE');
			$scope.toggleRight = buildToggler('rightE');
			
			function buildToggler(componentId) { //function for hide and show the sidenav menu
				return function() {
					$mdSidenav(componentId).toggle();
				};
			};
			
			//Load file
			var path = "file/" + $scope.fileName + ".json";
			$http.get(path).then(function(response) {
				
				$scope.info = response.data;				
				
				//inizialite the variable service
				variableList.initialize($scope.info.variables.open_tag, $scope.info.variables.close_tag, $scope.info.variables.variables_list);
				
				//bring home page object and layout
				$scope.active_page_id = $scope.info.containers.home;  //home page id
				
				for(var i = 0; i < $scope.info.containers.c_list.length; i++){
					if($scope.info.containers.c_list[i].id == $scope.active_page_id){
						$scope.active_page_obj = $scope.info.containers.c_list[i]; 			//home page object
					}
				}
				$scope.active_page_layout =  $scope.info.layout.dropzones[$scope.active_page_id]; //home page layout
				
				messageService.showMessage('Configuration file loaded correctly','success','Success');
				
				
			}, function(response){
				
				messageService.showMessage('The configuration file could not be found (message: "' + response.statusText + '", code: '+response.status+')', 'error', 'Error');
				$scope.load_error = true;
				$scope.load_error_text = 'The configuration file could not be found (message: "' + response.statusText + '", code: '+response.status+')';
			});
			
			//function for change page content
			$scope.goTo =  function(url){
				
				console.log("GOTO", url);
				
				if(url != '#')
				{
					if(checkUrl(url)){
						//external link
					 $window.open(url,'_blank');
						//$window.location.href = url;
					}
					else {
						//internal link
						//search page id 
						for(var i = 0; i < $scope.info.containers.c_list.length; i++){
							if($scope.info.containers.c_list[i].url == url){
								$scope.active_page_obj = $scope.info.containers.c_list[i];   		//current page object
								$scope.active_page_id = $scope.info.containers.c_list[i].id; 		//current page id
							}
						}
						
						$scope.active_page_layout =  $scope.info.layout.dropzones[$scope.active_page_id]; //current page layout
					}
				}
			}
			
			//function for get upload resource
			$scope.uploadResource = function(resourceName) {
				var path = "";
				
				//check if is external resource
				if(!checkUrl(resourceName)){
					var path = "upload/" + resourceName;
				}
				else{
					var path = resourceName;
				}
				return path;
			};
			
			//function for get element type by id
			$scope.getElemTypeById = function(elemId) {
				for(var i = 0; i < $scope.active_page_obj.elements.length; i++){
					if($scope.active_page_obj.elements[i].id == elemId){
						return $scope.active_page_obj.elements[i].type;
					}
				}
			};
			
			//function for get element obj by id
			$scope.getElemObjById = function(elemId) {
				for(var i = 0; i < $scope.active_page_obj.elements.length; i++){
					if($scope.active_page_obj.elements[i].id == elemId){
						return $scope.active_page_obj.elements[i];
					}
				}
			};
			
			//function for check url
			function checkUrl(url){
				var urlRegex = "(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9]\.[^\s]{2,})";
				var pattern = new RegExp(urlRegex, 'i');
				if (pattern.test(url)) {
					return true;
				} else{
					return false;
				}            
			};	
		},
		templateUrl: "engine/myDemo.html"			
	}; 
});

