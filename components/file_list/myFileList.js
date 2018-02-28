// File Table dierctive
app.directive("myFileList", function() { 
	return { 
		restrict: "E", 
		templateUrl: "components/file_list/myFileList.html"
	}; 
});

// Custom Button
app.directive('mdtCustomCellButtonOpen', function () {
	return {
		template: '<md-button class="md-raised md-primary"><ng-md-icon icon="open_in_browser" style="fill: white" size="20"></ng-md-icon></md-button>'
	};
});

app.directive('mdtCustomCellButtonDownload', function () {
	return {
		template: '<md-button class="md-raised" style="background-color: #009688;"><ng-md-icon icon="file_download" style="fill: white;" size="20"></ng-md-icon></md-button>'
	};
});

app.directive('mdtCustomCellButtonPreview', function () {
	return {
		template: '<md-button class="md-raised md-accent"><ng-md-icon icon="play_circle_outline" style="fill: white" size="20"></ng-md-icon></md-button>'
	};
});

app.directive('mdtCustomCellButtonDelete', function () {
	return {
		template: '<md-button class="md-raised md-warn"><ng-md-icon icon="delete" style="fill: white" size="20"></ng-md-icon></md-button>'
	};
});