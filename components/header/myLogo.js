app.directive("myLogo", function() { 
	return { 
		restrict: "E", 
		//transclude: true,
		scope: { 
			myElement: "=",
			deleteLogo:"&action"
		},
		controller :function MyChartController($scope, variableList, Upload) {
			
			//upload logo
			$scope.uploadLogo = function(file, errFiles) {
				$scope.f = file;
				$scope.errFile = errFiles && errFiles[0];
				console.log(file);
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
						$scope.myElement.image = file.name;
					});
				}   
			}
			
		},
		templateUrl: "components/header/myLogo.html"			
	}; 
});