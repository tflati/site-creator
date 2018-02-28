app.directive("myDataTable", function() { 
	return { 
		restrict: "E", 
		scope: { 
			myElement: "=",
			deleteDataTable:"&action"
		},
		controller :function MyDataTableController($scope, $mdDialog, variableList) {
			$scope.visibility = false;
			$scope.new_variables = [];
			
			$scope.showDataTable = function () {	
				if($scope.visibility == true){
					$scope.visibility = false;
				}
				else{
					$scope.visibility = true;
				}
			};
			
			/*******************************************/
			
			$scope.checkSource = function () {	
				$scope.new_variables = variableList.check($scope.myElement.source);
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
			$scope.$watch("myElement.source", function(newValue, oldValue) {
				if (newValue != oldValue){
					$scope.checkSource();
				}
			});
			
			//Watch for change in variable's list in the service
			$scope.$watch(function() { return variableList.getVObj(); }, function(newVal) { 
				$scope.checkSource();
			}, true);
		},
		templateUrl: "components/container/element/datatable/elementDataTable.html"			
	}; 
});
