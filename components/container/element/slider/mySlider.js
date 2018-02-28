app.directive("mySlider", function() { 
	return { 
		restrict: "E", 
		scope: { 
			myElement: "=",
			deleteSlider:"&action"
		},
		controller :function MySliderController($scope, $mdDialog, variableList) {
			$scope.visibility = false;
			$scope.new_var = ""
			$scope.new_variables = [];	
			$scope.variables_list = [];	
			
			$scope.showSlider = function () {	
				if($scope.visibility == true){
					$scope.visibility = false;
				}
				else{
					$scope.visibility = true;
					$scope.checkSource();
				}
			};
			
			$scope.checkSource = function () {	
				$scope.new_variables = variableList.check($scope.new_var);
				$scope.variables_list = variableList.getVObj().variables_list;
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
			$scope.$watch("new_var", function(newValue, oldValue) {
				if (newValue != oldValue){
					$scope.checkSource();
				}
			});
			
			//Watch for change in variable's list in the service
			$scope.$watch(function() { return variableList.getVObj(); }, function(newVal) { 
				$scope.checkSource();
			}, true);
			
		},
		templateUrl: "components/container/element/slider/elementSlider.html"			
	}; 
});	