// Directive for define the text field inside the form
app.directive("myCheckboxField", function() { 
	return { 
		restrict: "E", 
		//transclude: true,
		scope: { 
			myField: "=",
			deleteField:"&action",
			moveUpField:"&action2",
			moveDownField:"&action3"
		},
		controller :function MyCheckedFieldController($scope) {
			$scope.visibility = false;
							
			$scope.showCheckboxField = function () {	
				if($scope.visibility == true){
					$scope.visibility = false;
				}
				else{
					$scope.visibility = true;
				}
			};	
		},
		templateUrl: "components/container/element/form/field/checkbox/checkboxField.html"			
	}; 
});