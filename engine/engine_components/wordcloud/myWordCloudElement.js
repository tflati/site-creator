app.directive("myWordCloudElement", function() { 
	return { 
		restrict: "E", 
		scope: { 
			myElement: "=" 
		},
		controller :function MyWordCloudElementController($scope, $http, variableList) {
			$scope.customcolors = [];
			
			if(!$scope.myElement.demo){
				$scope.$watch(function() { return variableList.getVariableList($scope.myElement.source); }, function(newValue, oldValue) { 
					
					//resolve the variable inside the original url
					$scope.source = variableList.resolveVariable($scope.myElement.source);
					
					//reload the source
					loadWordCloud($scope.source);
				}, true);
			}
			else{
				$scope.source = "script/demo_wcloud/demo1.json";
				
				loadWordCloud($scope.source);
			}
			
			
			
			function loadWordCloud(url){	
				$http.get(url).then(function(response) {
					
					$scope.words = response.data.words;	
									
				}, function(response){
					
					$scope.error = 'Error while loading the data';
				});
			}
					
		},
		templateUrl: "engine/engine_components/wordcloud/myWordCloudElement.html"			
	}; 
});