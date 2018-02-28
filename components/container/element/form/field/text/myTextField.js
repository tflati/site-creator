// Directive for define the text field inside the form
app.directive("myTextField", function() { 
	return { 
		restrict: "E", 
		//transclude: true,
		scope: { 
			myField: "=",
			deleteField:"&action",
			moveUpField:"&action2",
			moveDownField:"&action3"
		},
		controller :function MyTextFieldController($scope) {
			$scope.visibility = false;
							
			$scope.showTextField = function () {	
				if($scope.visibility == true){
					$scope.visibility = false;
				}
				else{
					$scope.visibility = true;
				}
			};	
		},
		templateUrl: "components/container/element/form/field/text/textField.html"			
	}; 
});