// Directive for define the select field inside the form
app.directive("myButton", function() { 
	return { 
		restrict: "E", 
		//transclude: true,
		scope: { 
			myItem: "=",
			deleteItem:"&action",
			moveUpItem:"&action2",
			moveDownItem:"&action3"
		},
		controller :function MyButtonController($scope, $mdDialog, $timeout, variableList, Upload) {
			
			$scope.visibility = false;
			$scope.new_var = "";
			$scope.new_variables = [];	
			$scope.new_variables2 = [];	
			$scope.variables_list = [];	
			$scope.button_component = $scope.myItem.items[0].type;
			$scope.action_variables = [];
			
			//initialize action variable
			if($scope.myItem.action != ""){
				for(i = 0; i < $scope.myItem.action.action_variables.length; i++){
					$scope.action_variables.push($scope.myItem.action.action_variables[i].key);
				}
			}
			
			$scope.showSelectItem = function () {	
				if($scope.visibility == true){
					$scope.visibility = false;
				}
				else{
					$scope.visibility = true;
				}
			};	
			
			$scope.changeComponent = function () {
				switch($scope.button_component) {
					case "text":
						$scope.myItem.items.shift(); //delete the first element on button item (icon or image)
						break;
						
					case "icon":
						if($scope.myItem.items[0].type != "icon"){ //check if the first element is different from icon
							if($scope.myItem.items[0].type == "image") $scope.myItem.items.shift(); //delete first element
						
							$scope.myItem.items.unshift( 	//add new first element (icon)
								{
									"type" : "icon",
									"icon_color" : "black",
									"url" : "",
									"target" : "",
									"icon_img" : "fa-lg",
									"icon" : "",
									"title" : "",
									"pedix" : []
								}
							);	
						}
						
						break;
						
					case "image":
						if($scope.myItem.items[0].type != "image"){//check if the first element is different from icon
							if($scope.myItem.items[0].type == "icon") $scope.myItem.items.shift(); //delete first element
						
							$scope.myItem.items.unshift( 	//add new first element (icon)
								{
									"type" : "image",
									"img_src" : "",
									"height" : 32,
									"width" : 32,
									"url" : "",
									"target" : "",
									"title" : "",
									"pedix" : []
								}
							);	
						}
						
						break;
				}
			}
			
			//function for upload image
			$scope.uploadObj = function(file, errFiles) {
				$scope.f = file;
				$scope.errFile = errFiles && errFiles[0];
				
				if (file) {
					file.upload = Upload.upload({
						url: 'script/upload_object.php', 
						method: 'POST',
						file: file,
						data: {
							'targetPath' : '../upload/'
						}
					});

					file.upload.then(function (response) {
						$timeout(function () {
							file.result = response.data;
						});
					}, function (response) {
						if (response.status > 0) $scope.errorMsg = response.status + ': ' + response.data;
					}, function (evt) {
						file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
						$scope.myItem.items[0].img_src = file.name;
					});
				}   
			};
			
			$scope.checkSource = function () {	
				$scope.new_variables = variableList.check($scope.myItem.items[0].img_src);
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
			
			//WATCH	
			$scope.$watch("myItem.items[0].img_src", function(newValue, oldValue) {
				if (newValue != oldValue){
					$scope.checkSource();
				}
			});
			
			//Watch for change in variable's list in the service
			$scope.$watch(function() { return variableList.getVObj(); }, function(newVal) { 
				$scope.checkSource();
			}, true);
			
			
			
			//WATCH	action write
			$scope.checkSource2 = function () {	
			
				$scope.new_variables2 = variableList.check($scope.new_var);
				$scope.variables_list = variableList.getVObj().variables_list;
					
				//update the variable list in myItem.action
				//if($scope.myItem.action != "") $scope.updateActionVariables($scope.action_variables);
				
			};
			
			$scope.$watch("new_var", function(newValue, oldValue) {
				if (newValue != oldValue){
					$scope.checkSource2();
					
				}
			});
			
			//Watch for change in variable's list in the service
			$scope.$watch(function() { return variableList.getVObj(); }, function(newVal) { 
				$scope.checkSource2();
			}, true);
			
			
			$scope.updateActionVariables = function (var_array) {
			
				console.log(var_array);
				var new_array = [];
				
				for(i = 0; i < var_array.length; i++){
					
					//serch the variable in current array
					var flag = true;
					for(var j = 0; i < $scope.myItem.action.action_variables.length; j++) {
						if ($scope.myItem.action.action_variables[j].key == var_array[i]) {
							//if variable already exist copy the current value
							new_array.push({"key" : $scope.myItem.action.action_variables[j].key, "value" : $scope.myItem.action.action_variables[j].value});
							flag = false;
							break;
						}
					}
					
					//if the variable is new add it to array
					if(flag){
						new_array.push({"key" : var_array[i], "value" : ""});
					}					
				}
				
				$scope.myItem.action.action_variables = new_array;
			}
			
		},
		templateUrl: "components/container/element/button_group/button/button.html"			
	}; 
});