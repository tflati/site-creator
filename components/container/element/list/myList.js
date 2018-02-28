app.directive("myList", function() { 
	return { 
		restrict: "E", 
		scope: { 
			myElement: "=",
			deleteList:"&action"
		},
		controller :function MyListController($scope, $mdDialog, variableList) {
			$scope.visibility = false;
			$scope.new_variables = [];
			
			$scope.showList = function () {	
				if($scope.visibility == true){
					$scope.visibility = false;
				}
				else{
					$scope.visibility = true;
				}
			};
			
			$scope.addItem = function () {	
				$scope.myElement.items.push({"use_image" : true, "image" : "", "icon" : "", "icon_color":"black", "icon_dim":"3x", "title" : "", "subtitle" : "", "text" : ""});
			};
			
			$scope.deleteItem = function (array, index) {	
				array.splice(index, 1);
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
			
			$scope.showDeleteItemDialog = function (message, array, index) {	
				var confirm = $mdDialog.confirm()
				.title("Delete item")
				.textContent(message)
				.ok("Yes")
				.cancel("Cancel");

				$mdDialog.show(confirm).then(function() {	
					array.splice(index, 1);
				})
			};
			
			/*******************************************/
			
			$scope.checkSource = function () {	
				$scope.new_variables = variableList.check($scope.myElement.source);
			};
			
			$scope.addVariable = function (name) {	
				variableList.add(name);
				$mdDialog.show(
					$mdDialog.alert()
						.parent(angular.element(document.querySelector("#mainContainer")))
						.clickOutsideToClose(true)
						.title("Add variable")
						.textContent("Success!")
						.ariaLabel("Alert Dialog Demo")
						.ok("Ok")	
				);
			};	
			
			//WATCH	
			$scope.$watch("myElement.source", function(newValue, oldValue) {
				if (newValue != oldValue){
					$scope.checkSource();
				}
			});
			
			//Watch for change in variable"s list in the service
			$scope.$watch(function() { return variableList.getVObj(); }, function(newVal) { 
				$scope.checkSource();
			}, true);

		},
		templateUrl: "components/container/element/list/elementList.html"			
	}; 
});	