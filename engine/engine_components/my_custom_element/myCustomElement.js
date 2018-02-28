app.directive("myCustomElement", function() { 
	return { 
		restrict: "E", 
		scope: { 
			myElementC: "=" 
		},
		controller :function MyCustomCellController($scope) {},
		templateUrl: "engine/engine_components/my_custom_element/myCustomElement.html"			
	}; 
});