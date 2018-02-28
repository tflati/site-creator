app.directive("myFormElement", function() { 
	return { 
		restrict: "E", 
		scope: { 
			myElement: "=" 
		},
		controller :function MyFormElementController($scope, $http, $mdDialog, $timeout, $q, $log, variableList) {
			
			$scope.f_fields = {};
			$scope.simulateQuery = false;
			$scope.dynamic = {};
			
			function loadElements(url, data){	
				for(i = 0; i < $scope.dynamic[url].length; i++){
					$scope.dynamic[url][i].elements = data;
				}
			};
			
			//inizializzo le variabili del form
			for(var i = 0; i < $scope.myElement.fields.length; i++){	
				
				var var_name = $scope.myElement.fields[i].key;
				
				switch($scope.myElement.fields[i].type) {
					
					case 'checkbox':
						$scope.f_fields[var_name] = $scope.myElement.fields[i].checked;	
						break;
						
					case 'radio':
						$scope.f_fields[var_name] = "";	
						if($scope.myElement.fields[i].dynamic){
							
							var url = variableList.resolveVariable($scope.myElement.fields[i].source_url);
							
							$scope.dynamic[url] =  [];
							$scope.dynamic[url].push($scope.myElement.fields[i]);
														
							$http.get(url).then(function(response) {
								loadElements(response.config.url, response.data);			
							}, function(response){
								console.log("Error " + response.status);
							});
						};						
						break;
						
					case 'select':
						
						$scope.f_fields[var_name] = "";	
						
						if($scope.myElement.fields[i].dynamic){
							
							var url = variableList.resolveVariable($scope.myElement.fields[i].source_url);
							
							$scope.dynamic[url] =  [];
							$scope.dynamic[url].push($scope.myElement.fields[i]);
														
							$http.get(url).then(function(response) {
								loadElements(response.config.url, response.data);								
							}, function(response){
								console.log("Error " + response.status);
							});								
						}
						break;
						
					default:
						$scope.f_fields[var_name] = $scope.myElement.fields[i].default_value;	
				}	
			};
			
			$scope.sendData = function(url) {
				var urlV = variableList.resolveVariable(url);
				
				$http({
					method  : 'POST',
					url     : urlV,
					data    : $scope.f_fields,
					headers : {'Content-Type': 'application/x-www-form-urlencoded'} 
				})
				.success(function(data) {
					$mdDialog.show(
						$mdDialog.alert()
							.parent(angular.element(document.querySelector('#mainContainer')))
							.clickOutsideToClose(true)
							.title('Send data')
							.textContent(data)
							.ariaLabel('Alert Dialog Demo')
							.ok('Ok')	
					);		
				})
				.error(function() {
					$mdDialog.show(
						$mdDialog.alert()
							.parent(angular.element(document.querySelector('#mainContainer')))
							.clickOutsideToClose(true)
							.title('Send data')
							.textContent('Error impossible to make http call')
							.ariaLabel('Alert Dialog Demo')
							.ok('Ok')	
					);		
				});
			};
			
			//console.log($scope.dynamic);
		},
		templateUrl: "engine/engine_components/form/myFormElement.html"			
	}; 
});
