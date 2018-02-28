app.directive("myListElement", function() { 
	return { 
		restrict: "E", 
		scope: { 
			myElement: "=" 
		},
		controller :function MyListElementController($scope, $http, variableList) {
			
			if($scope.myElement.dynamic){
							
				
					$scope.$watch(function() { return variableList.getVariableList($scope.myElement.source); }, function(newValue, oldValue) { 
					
						//resolve the variable inside the original url
						var url = variableList.resolveVariable($scope.myElement.source);
						
						//reload the source	
						$http.get(url).then(function(response) {
							$scope.element_list = response.data.items;			
						}, function(response){
							console.log("Error " + response.status);
						});
					}, true);				
			}
			else{
				$scope.element_list = $scope.myElement.items; 
			};	

			$scope.uploadResource = function(resourceName) {
				
				var path = "";
				path = variableList.resolveVariable(resourceName);
				
				//check if is external resource
				if(!checkUrl(path)){
					var path = "upload/" + path;
				}
		
				return path;
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
		templateUrl: "engine/engine_components/list/myListElement.html"			
	}; 
});