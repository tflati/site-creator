app.directive("myWordCloud", function() { 
	return { 
		restrict: "E", 
		//transclude: true,
		scope: { 
			myElement: "=",
			deleteWordCloud:"&action"
		},
		controller :function MyWordCloudController($scope, $mdDialog, variableList) {
			$scope.visibility = false;
			$scope.new_variables = [];
							
			$scope.showWordCloud = function () {	
				if($scope.visibility == true){
					$scope.visibility = false;
				}
				else{
					$scope.visibility = true;
					$scope.checkSource();
				}
			};
			
					
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
		templateUrl: "components/container/element/word_cloud/elementWordCloud.html"			
	}; 
});