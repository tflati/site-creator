app.directive("buttonElement", function() { 
	return { 
		restrict: "E", 
		scope: { 
			myButton: "=" 
		},
		controller :function buttonElementController($scope, $http, variableList) {
			
			$scope.doAction = function(){
				switch($scope.myButton.action.action_type) {
					case "download":
						downloadObj($scope.myButton.action.action_url);
						break;
					case "link":
						goToLink($scope.myButton.action.action_url, $scope.myButton.action.action_target);
						break;
					case "write":
						writeVariables($scope.myButton.action.action_variables);
						break;
				}
			}
			
			//download action
			function downloadObj(source) { 
								
				$http({
					method  : 'POST',
					url     : source
				})
				.success(function(data) {
				
					var a = document.createElement("a");
						document.body.appendChild(a);
						a.style = "display: none";
						a.target = "_blank";
					
						var url = window.URL.createObjectURL(new Blob([data.content], {type: "octet/stream"})); //create blob object for the content
						
						a.href = url;
						a.download = data.filename;
						a.click();
						window.URL.revokeObjectURL(url);
				})
				.
				error(function() {
					console.log("BUTTON CLICK FAILED");	
				});
			}
			
			
			//link action
			function goToLink(source, target) { 
				
				var url = variableList.resolveVariable(source);
				//create a link
				var a = document.createElement("a");
				document.body.appendChild(a);
				a.style = "display: none";
				a.target = target;
				a.href = url;
				
				//simulate click on link
				a.click();
				window.URL.revokeObjectURL(url);
			}
			
			
			//write variable action
			function writeVariables(var_array) { 
			
			
				for(i = 0; i < var_array.length; i++){
					variableList.updateValue(var_array[i].key, var_array[i].value);
				}
			}
			
		},
		templateUrl: "engine/engine_components/my_custom_element/element/buttonElement.html"			
	}; 
});