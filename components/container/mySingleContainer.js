app.directive("mySingleContainer", function() { 
	return { 
		restrict: "E", 
		scope: { 
			container: "=",
			deleteContainer:"&action"
		},
		controller :function MyContainerController($scope, $mdDialog, layoutService) {
			$scope.visibility = false;
			
			$scope.showContainer = function () {	
				if($scope.visibility == true){
					$scope.visibility = false;
				}
				else{
					$scope.visibility = true;
				}
			};
			
			$scope.showDeleteElementDialog = function (message, array, index) {	
				var confirm = $mdDialog.confirm()
				.title('Delete element')
				.textContent(message)
				.ok('Yes')
				.cancel('Cancel');

				$mdDialog.show(confirm).then(function() {	
					layoutService.deleteElement($scope.container.id, index);
				})
			};
			
			//add element dialog
			/********************************************/
			$scope.showAddElementDialog = function(ev) { //function for open the "add element" dialog
				$mdDialog.show({  
					locals:{},   
					controller: ElementDialogController,
					templateUrl: 'components/container/addElementDialog.html',
					parent: angular.element(document.body),
					targetEvent: ev,
					clickOutsideToClose:true,
					fullscreen: false
				})
				.then(function(answer) {
					layoutService.addElement(answer,$scope.container.id);
				});
			};
			
			//container dialog controller
			function ElementDialogController($scope, $mdDialog, locals) { 
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
		},
		templateUrl: "components/container/singleContainerForm.html"			
	}; 
});