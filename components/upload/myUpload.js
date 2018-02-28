app.directive("myUpload", function() { 
	return { 
		restrict: "E", 
		scope: { 
			myElement: "=",
			myLabel: "@?"
		},
		controller :function MyUploadController($scope, $mdDialog, variableList, Upload, $timeout) {
			$scope.new_variables = [];
			
			
			$scope.checkSource = function () {	
				$scope.new_variables = variableList.check($scope.myElement);
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
			$scope.$watch("myElement", function(newValue, oldValue) {
				if (newValue != oldValue){
					$scope.checkSource();
				}
			});
			
			//Watch for change in variable's list in the service
			$scope.$watch(function() { return variableList.getVObj(); }, function(newVal) { 
				$scope.checkSource();
			}, true);
			
			//upload image
			$scope.uploadImage = function(file, errFiles) {
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
						$scope.myElement = file.name;
					});
				}   
			}
		},
		templateUrl: "components/upload/elementUpload.html"			
	}; 
});	