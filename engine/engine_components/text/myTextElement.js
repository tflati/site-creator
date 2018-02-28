app.directive("myTextElement", function() { 
	return { 
		restrict: "E", 
		scope: { 
			myElement: "=" 
		},
		controller :function MyTextElementController($scope, variableList) {},
		templateUrl: "engine/engine_components/text/myTextElement.html"			
	}; 
});