// Directive for define the number field inside the form
app.directive("myNumberField", function() { 
	return { 
		restrict: "E", 
		//transclude: true,
		scope: { 
			myField: "=",
			deleteField:"&action",
			moveUpField:"&action2",
			moveDownField:"&action3"
		},
		controller :function MyNumberFieldController($scope) {
			$scope.visibility = false;
							
			$scope.showNumberField = function () {	
				if($scope.visibility == true){
					$scope.visibility = false;
				}
				else{
					$scope.visibility = true;
				}
			};	
		},
		templateUrl: "components/container/element/form/field/number/numberField.html"			
	}; 
});