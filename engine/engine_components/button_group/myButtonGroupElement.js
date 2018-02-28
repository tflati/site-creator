app.directive("myButtonGroupElement", function() { 
	return { 
		restrict: "E", 
		scope: { 
			myElement: "=" 
		},
		controller :function MyIFrameElementController($scope, $http, variableList) {
			
			if($scope.myElement.dynamic){
							
				var url = variableList.resolveVariable($scope.myElement.source);
				
				$http.get(url).then(function(response) {
				
					$scope.b_elements = response.data;			
				}, function(response){
					console.log("Error " + response.status);
				});
			}
			else{
				
				$scope.b_elements = [];
				for(var i = 0; i < $scope.myElement.buttons.length; i++){
					var b = [];
					b.push( $scope.myElement.buttons[i]);
					$scope.b_elements.push(b);
				};
			};	
			
		},
		templateUrl: "engine/engine_components/button_group/myButtonGroupElement.html"			
	}; 
});