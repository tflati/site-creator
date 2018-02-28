app.directive("myChart", function() { 
	return { 
		restrict: "E", 
		//transclude: true,
		scope: { 
			myElement: "=",
			deleteChart:"&action"
		},
		controller :function MyChartController($scope, $mdDialog, variableList) {
			$scope.visibility = false;
			$scope.new_variables = [];
							
			$scope.showChart = function () {	
				if($scope.visibility == true){
					$scope.visibility = false;
				}
				else{
					$scope.visibility = true;
					$scope.checkSource();
				}
			};
			
			//demo chart dialog
			/********************************************/
			$scope.showDemoChartDialog = function(ev) { 
				$mdDialog.show({  
					locals:{chart_type: $scope.myElement.chart_type},
					controller: DemoChartController,
					templateUrl: 'components/container/element/chart/demoChartDialog.html',
					parent: angular.element(document.body),
					targetEvent: ev,
					clickOutsideToClose:true,
					fullscreen: false
				});
			};
			
			//container dialog controller
			function DemoChartController($scope, $mdDialog, locals) { 
				$scope.locals = locals;
				$scope.choices = {};
				
				$scope.hide = function() {
					$mdDialog.hide();
				};

				$scope.cancel = function() {
					$mdDialog.cancel();
				};
			}
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
		templateUrl: "components/container/element/chart/elementChart.html"			
	}; 
});