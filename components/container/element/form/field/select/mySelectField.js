// Directive for define the select field inside the form
app.directive("mySelectField", function() { 
	return { 
		restrict: "E", 
		//transclude: true,
		scope: { 
			myField: "=",
			deleteField:"&action",
			moveUpField:"&action2",
			moveDownField:"&action3"
		},
		controller :function MySelectFieldController($scope, $mdDialog, variableList) {
			$scope.visibility = false;
			$scope.new_variables = [];
							
			$scope.showSelectField = function () {	
				if($scope.visibility == true){
					$scope.visibility = false;
				}
				else{
					$scope.visibility = true;
				}
			};	
			
			$scope.addElement = function () {	
				$scope.myField.elements.push({"name" : "", "value" : ""});
			};
			
			$scope.deleteElement = function (array, index) {	
				array.splice(index, 1);
			};
				
			/******************************************************/
			$scope.checkSource = function () {	
				$scope.new_variables = variableList.check($scope.myField.source_url);
			};
							
			$scope.addVariable = function (name) {	
				variableList.add(name);
				$mdDialog.show(
					$mdDialog.alert()
						.parent(angular.element(document.querySelector('#mainContainer')))
						.clickOutsideToClose(true)
						.title('Add variable')
						.textContent('Success!')
						.ariaLabel('Alert Dialog Demo')
						.ok('Ok')	
				);
			};	
			
			//WATCH	
			$scope.$watch("myField.source_url", function(newValue, oldValue) {
				if (newValue != oldValue){
					$scope.checkSource();
				}
			});
			
			//Watch for change in variable's list in the service
			$scope.$watch(function() { return variableList.getVObj(); }, function(newVal) { 
				$scope.checkSource();
			}, true);
		},
		templateUrl: "components/container/element/form/field/select/selectField.html"			
	}; 
});