app.directive("myIFrameElement", function() { 
	return { 
		restrict: "E", 
		scope: { 
			myElement: "=" 
		},
		controller :function MyIFrameElementController($scope, $sce, variableList) {
			
			$scope.source = "";
			$scope.source_url = "";
			
			//create onwatch on the variables inside url
			$scope.$watch(function() { return variableList.getVariableList($scope.myElement.source); }, function(newValue, oldValue) { 
					
				$scope.source = variableList.resolveVariable($scope.myElement.source);
				$scope.source_url = $sce.trustAsResourceUrl($scope.source);

			}, true);
			
		},
		templateUrl: "engine/engine_components/iframe/myIFrameElement.html"			
	}; 
});
