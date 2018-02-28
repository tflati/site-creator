app.directive("myText", function() { 
	return { 
		restrict: "E", 
		scope: { 
			myElement: "=",
			deleteText:"&action"
		},
		controller :function MyTextController($scope, $mdDialog) {
			$scope.visibility = false;
						
			$scope.showText = function () {	
				if($scope.visibility == true){
					$scope.visibility = false;
				}
				else{
					$scope.visibility = true;
				}
			};
		},
		templateUrl: "components/container/element/text/elementText.html"			
	}; 
});	