app.directive("myButtonGroupItem", function() { 
	return { 
		restrict: "E", 
		scope: { 
			myElement: "=",
			deleteBG:"&action"
		},
		controller :function MyButtonGroupItemController($scope, $mdDialog, layoutService, variableList) {
			$scope.visibility = false;
			$scope.new_variables = [];
							
			$scope.showBG = function () {	
				if($scope.visibility == true){
					$scope.visibility = false;
				}
				else{
					$scope.visibility = true;
					$scope.checkSource();
				}
			};
			
			$scope.moveFieldDialog = function (position, array, index) {	
			
				var app = array[index];
				var l = array.length;
				
				if(l > 1){
					if(position == "up"){
						if(index != 0){
							array[index] = array[index - 1];
							array[index - 1] = app;
						}
					}else{
						if(index != l - 1){
							array[index] = array[index + 1];
							array[index + 1] = app;
						}
					}
				}
			};
				
			$scope.addButton = function () {	
				var id = layoutService.getId();
				$scope.myElement.buttons.push(
						{
							"id" : id,
							"type" : "button", 
							"action" : {
								"action_type" : "",
								"action_url" : "",
								"action_target" : "_blank",
								"action_variables" : []
							}, 
							"color" : "", 
							"title" : "", 
							"disabled" : false, 
							"items" : [				
								{	
									 "type": "text",
									 "label": "",
									 "title": "",
									 "color": "black",
									 "url": "",
									 "target": "",
									 "pedix": []
								}

							]
						}
					);
			};
			
									
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
			
			$scope.showDeleteButtonDialog = function (message, array, index) {	
				var confirm = $mdDialog.confirm()
				.title("Delete button")
				.textContent(message)
				.ok("Yes")
				.cancel("Cancel");

				$mdDialog.show(confirm).then(function() {	
					array.splice(index, 1);
				})
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
		templateUrl: "components/container/element/button_group/buttonGroupItem.html"			
	}; 
});