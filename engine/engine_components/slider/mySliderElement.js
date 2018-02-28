app.directive("mySliderElement", function() { 
	return { 
		restrict: "E", 
		scope: { 
			myElement: "=" 
		},
		controller :function MyTextElementController($scope, variableList) {
				
			//inizialite the variable
			var v_obj = variableList.getVObj();
			var url = v_obj.open_tag + $scope.myElement.variable + v_obj.close_tag;
			$scope.chosen_value = variableList.resolveVariable(url);
			
			if($scope.chosen_value == undefined) $scope.chosen_value = $scope.myElement.min_value;
		
			//function for update the variable in the service
			$scope.updateSliderVariable = function (new_value) {	
				variableList.updateValue($scope.myElement.variable, new_value);
			};
			
		},
		templateUrl: "engine/engine_components/slider/mySliderElement.html"			
	}; 
});