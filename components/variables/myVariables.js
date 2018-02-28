//Variable area directive
app.directive("myVariables", function() { 
	return { 
		restrict: "E", 
		templateUrl: "components/variables/variablesForm.html"
	}; 
});