app.directive("myPTreeElement", function() { 
	return { 
		restrict: "E", 
		scope: { 
			myElement: "=" 
		},
		controller :function MyPTreeElementController($scope, $http, variableList) {
			
			
			$scope.$watch(function() { return variableList.getVariableList($scope.myElement.source); }, function(newValue, oldValue) { 
				
				//resolve the variable inside the original url
				$scope.source = variableList.resolveVariable($scope.myElement.source);
				
				//reload the source
				$http.get($scope.source).then(function(response) {
					$scope.newick = response.data.newick_tree;
					loadPTree($scope.newick);
				});
			}, true);
			
			function loadPTree(newick) {
				var tree = d3.layout.phylotree().svg(d3.select("#tree")).radial($scope.myElement.radial);
				var phylotree = tree(d3.layout.newick_parser(newick))
				phylotree.layout();
			}

			
		},
		templateUrl: "engine/engine_components/ptree/myPTreeElement.html"			
	}; 
});