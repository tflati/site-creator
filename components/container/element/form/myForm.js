app.directive("myForm", function() { 
	return { 
		restrict: "E", 
		scope: { 
			myElement: "=",
			deleteForm:"&action"
		},
		controller :function MyFormController($scope, $mdDialog, variableList) {
			$scope.visibility = false;
			$scope.new_variables = [];
			
			$scope.showForm = function () {	
				if($scope.visibility == true){
					$scope.visibility = false;
				}
				else{
					$scope.visibility = true;
				}
			};
			$scope.test = function() { 
			alert("test");
			}
			
			/***Dialog for add field***/
			$scope.showAddFieldDialog = function(ev) { //function for open the "add element" dialog
				$mdDialog.show({  
					locals:{},   
					controller: FieldDialogController,
					templateUrl: 'components/container/element/form/addFieldDialog.html',
					parent: angular.element(document.body),
					targetEvent: ev,
					clickOutsideToClose:true,
					fullscreen: true
				})
				.then(function(answer) {
					
					//text field
					if(answer.text)
					{
						if(answer.textN >=1 && answer.textN <=5){
							for(i = 0; i < answer.textN; i++){
								$scope.myElement.fields.push({
									"type" : "text",
									"label" : "", 
									"key" : "",
									"hint" : "",
									"default_value" : "", 
									"required" : false
								});
							}
						}
					}
					
					//number field
					if(answer.number)
					{
						if(answer.numberN >=1 && answer.numberN <=5){
							for(i = 0; i < answer.numberN; i++){
								$scope.myElement.fields.push({
									"type" : "number",
									"label" : "", 
									"key" : "",
									"hint" : "",
									"default_value" : "", 
									"min_value" : "",
									"max_value" : "",
									"step_dimension" : "",
									"required" : false,
								});
							}
						}
					}
					
					//email field
					if(answer.email)
					{
						if(answer.emailN >=1 && answer.emailN <=5){
							for(i = 0; i < answer.emailN; i++){
								$scope.myElement.fields.push({
									"type" : "email",
									"label" : "", 
									"key" : "",
									"hint" : "",
									"default_value" : "", 
									"required" : false
								});
							}
						}
					}
					
					//date field
					if(answer.date)
					{
						if(answer.dateN >=1 && answer.dateN <=5){
							for(i = 0; i < answer.dateN; i++){
								$scope.myElement.fields.push({
									"type" : "date",
									"label" : "", 
									"key" : "",
									"hint" : "",
									"default_value" : "", 
									"required" : false
								});
							}
						}
					}
					
					//password field
					if(answer.password)
					{
						if(answer.passwordN >=1 && answer.passwordN <=5){
							for(i = 0; i < answer.passwordN; i++){
								$scope.myElement.fields.push({
									"type" : "password",
									"label" : "", 
									"key" : "",
									"hint" : "",
									"required" : false
								});
							}
						}
					}
					
					//checkbox field
					if(answer.checkbox)
					{
						if(answer.checkboxN >=1 && answer.checkboxN <=5){
							for(i = 0; i < answer.checkboxN; i++){
								$scope.myElement.fields.push({
									"type" : "checkbox",
									"label" : "", 
									"key" : "",
									"checked" : false,
									"required" : false
								});
							}
						}
					}
					
					//select field
					if(answer.select)
					{
						if(answer.selectN >=1 && answer.selectN <=5){
							for(i = 0; i < answer.selectN; i++){
								$scope.myElement.fields.push({
									"type" : "select",
									"label" : "", 
									"key" : "",
									"autocomplete" : false,
									"dynamic" : false,
									"source_url" : "",
									"elements" : [],
									"multiple" : false,
									"required" : false
								});
							}
						}
					}
					
					//radio button field
					if(answer.radio)
					{
						if(answer.radioN >=1 && answer.radioN <=5){
							for(i = 0; i < answer.radioN; i++){
								$scope.myElement.fields.push({
									"type" : "radio",
									"label" : "", 
									"key" : "",
									"dynamic" : false,
									"source_url" : "",
									"elements" : [],
									"required" : false
								});
							}
						}
					}
				});
			};
			
			//function for delete field
			$scope.showDeleteFieldDialog = function (message, array, index) {	
				var confirm = $mdDialog.confirm()
				.title('Delete field')
				.textContent(message)
				.ok('Yes')
				.cancel('Cancel');

				$mdDialog.show(confirm).then(function() {	
					array.splice(index, 1);
				})
			};
			
			//function for move field
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
			
			//container dialog controller
			function FieldDialogController($scope, $mdDialog, locals) { 
				$scope.locals = locals;
				$scope.choices = {};
				
				$scope.hide = function() {
					$mdDialog.hide();
				};

				$scope.cancel = function() {
					$mdDialog.cancel();
				};

				$scope.answer = function(answer) {
					$mdDialog.hide(answer);
				};
			}
			/*******************************************/
			
			$scope.checkSource = function () {	
				$scope.new_variables = variableList.check($scope.myElement.submit.url);
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
			$scope.$watch("myElement.submit.url", function(newValue, oldValue) {
				if (newValue != oldValue){
					$scope.checkSource();
				}
			});
			
			//Watch for change in variable's list in the service
			$scope.$watch(function() { return variableList.getVObj(); }, function(newVal) { 
				$scope.checkSource();
			}, true);

		},
		templateUrl: "components/container/element/form/elementForm.html"			
	}; 
});