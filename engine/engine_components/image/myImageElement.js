app.directive("myImageElement", function() { 
	return { 
		restrict: "E", 
		scope: { 
			myElement: "=" 
		},
		controller :function MyImageElementController($scope, variableList) {
			
			$scope.image_path = "";
			
			//create onwatch on the variables inside url
			$scope.$watch(function() { return variableList.getVariableList($scope.myElement.source); }, function(newValue, oldValue) { 
					
				//resolve the variable inside the original url
				var path = "";
				path = variableList.resolveVariable($scope.myElement.source);
				
				//check if is external resource
				if(!checkUrl(path)){
					var path = "upload/" + path;
				}
				
				//reload the image
				$scope.image_path = path;
			}, true);
			
			//function for check url
			function checkUrl(url){
				var urlRegex = "(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9]\.[^\s]{2,})";
				var pattern = new RegExp(urlRegex, 'i');
				if (pattern.test(url)) {
					return true;
				} else{
					return false;
				}            
			};
		},
		templateUrl: "engine/engine_components/image/myImageElement.html"			
	}; 
});