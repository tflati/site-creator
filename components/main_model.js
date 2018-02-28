	//MAIN CONTROLLER
	app.controller('MainCtrl', function ($scope, $timeout, $mdSidenav, $http, $mdDialog, $mdToast, variableList, messageService, layoutService, Upload) {
		
		$scope.toShow = "home";
		$scope.fullScreen = false;
				
		$scope.changeFullScreen = function () { 
			if($scope.fullScreen){
				$scope.fullScreen = false;
			} else {
				$scope.fullScreen = true;
			}
		};
		
		$scope.setRightSidebar = function (value) { 
			$scope.rightSidebar = value;
		};
		
		$scope.toggleLeft = buildToggler('left');
		$scope.toggleRight = buildToggler('right');
		
		function buildToggler(componentId) { //function for hide and show the sidenav menu
			return function() {
				$mdSidenav(componentId).toggle();
			};
		};
		
		//function for hide and show a page
		$scope.show = function (toShow) { 
			$scope.toShow = toShow;
		};
				
		//FILE FIELD
		$scope.file_list = null;
		$scope.active_file = "";
		$scope.active_file_id = "";

		$scope.file_options = {
			filename: '',
			owner: ''
		};
		
		//function for populate the file list
		$scope.fillFileList = function () {		
			$http({
				method: 'POST',
				url: 'json/file_list.json'
			})
			.success(function (data) {
				$scope.file_list = data
			})
			.
			error(function() {
				alert("Error impossible to make http call");		
			});
		};
		
		//FILE FUNCTIONS
		//function for open the JSON file
		$scope.openFile = function (id) {	
			if(id){
				//Open existing file	
				$scope.getFileInfo(id, function(data){
					$http({
					method: 'POST',
						url: 'file/' + data.filename + '.json',
					})
					.success(function (data1) {
						$scope.active_file = data1;
						$scope.active_file_id = id;
						$scope.file_options.filename = data.filename;
						$scope.file_options.owner = data.owner;
						$scope.show('work');
						
						//initisalite services
						
						//inizialite the variable service
						variableList.initialize($scope.active_file.variables.open_tag, $scope.active_file.variables.close_tag, $scope.active_file.variables.variables_list);	
						//binding
						$scope.active_file.variables = variableList.getVObj();
						
						//initialize layout service
						var maxElementId = 0;		
						for(var i = 0; i < $scope.active_file.containers.c_list.length; i++){
							if($scope.active_file.containers.c_list[i].elements.length  > 0){
								
								var maxButtonId = 0;
								
								//find for group of button element
								for(var j = 0; j < $scope.active_file.containers.c_list[i].elements.length; j++){
									
									if($scope.active_file.containers.c_list[i].elements[j].type == "button_group"){
										var max_button_id = Math.max.apply(null,
											Object.keys($scope.active_file.containers.c_list[i].elements[j].buttons).map(function(e) {
													return $scope.active_file.containers.c_list[i].elements[j].buttons[e]['id'];
											}));
										if(max_button_id > maxButtonId){
											maxButtonId = max_button_id;
										}
									}
								}
								
								//find max id in the container
								var max_element_id = Math.max.apply(null,
									Object.keys($scope.active_file.containers.c_list[i].elements).map(function(e) {
											return $scope.active_file.containers.c_list[i].elements[e]['id'];
									}));
									
								if(max_element_id >= maxButtonId){
									if(max_element_id > maxElementId){
										maxElementId = max_element_id;
									}
								} else {
									if(maxButtonId > maxElementId){
										maxElementId = maxButtonId;
									}
								}
								
							}		
						}
												
						var maxContainerId = 0;
						for(var i = 0; i < $scope.active_file.containers.c_list.length; i++){
							var id_value = $scope.active_file.containers.c_list[i].id;
							if(id_value > maxContainerId){
								maxContainerId = id_value;
							}
						}

						layoutService.initialize($scope.active_file.containers.c_list, $scope.active_file.layout.dropzones, maxContainerId, maxElementId);	
						//binding
						$scope.active_file.containers.c_list = layoutService.getContainerList();
						$scope.active_file.layout.dropzones = layoutService.getLayoutList();
		
					})
					.
					error(function() {	
						messageService.showMessage('Error impossible to make http call', 'error', 'Error');
					});
				});
			}
			else{
				//Open new file
				$http({
					method: 'POST',
					url: 'json/empty_model.json',
				})
				.success(function (data) {
					$scope.active_file = data;
					$scope.active_file_id = "";
					$scope.file_options.filename = "new_file";
					$scope.file_options.owner = "";
					
					//inizialite the variable service
					variableList.initialize($scope.active_file.variables.open_tag, $scope.active_file.variables.close_tag, $scope.active_file.variables.variables_list);
					//binding
					$scope.active_file.variables = variableList.getVObj();
					
					//initialize the layout service
					layoutService.initialize($scope.active_file.containers.c_list, $scope.active_file.layout.dropzones, 0, 0);	
					//binding between the scope variable and the service variable
					$scope.active_file.containers.c_list = layoutService.getContainerList();
					$scope.active_file.layout.dropzones = layoutService.getLayoutList();
				})
				.
				error(function() {
					messageService.showMessage('Error impossible to make http call', 'error', 'Error');	
				});
			}
		};
		
		//function for download the configuration file
		$scope.downloadFile = function(id) {	
			$scope.getFileInfo(id, function(data){
		
				var source = "file/" + data.filename + ".json";
				var file_name = data.filename + ".json";
				
				var a = document.createElement("a");
				document.body.appendChild(a);
				a.style = "display: none";
				a.target = "_blank";
				
				a.href = source;
				a.download = file_name;
				a.click();
				//window.URL.revokeObjectURL(source);				
			});
		}	
		
		
		//function for save the JSON file	
        $scope.saveFile = function(alertMsg) {	
			var msg = $scope.checkRequiredField();
			if(msg == ''){
				$http({
					method  : 'POST',
					url     : 'script/write_file.php',
					data    : {'options' : $scope.file_options, 'file' : $scope.active_file, 'file_id' : $scope.active_file_id},
					headers : {'Content-Type': 'application/x-www-form-urlencoded'} //DUBBIO
				})
				.success(function(data) {
					
					console.log("[SAVE]", "SERVER RESPONSE: (project id)", data);
					
					if (data == "KO") {
						alert("KO");
					} else {
						$scope.active_file_id = data; //the http call return the current file id
						if(alertMsg)
						{
							$mdDialog.show(
								$mdDialog.alert()
									.parent(angular.element(document.querySelector('#mainContainer')))
									.clickOutsideToClose(true)
									.title('Save file')
									.textContent('Success!')
									.ariaLabel('Alert Dialog Demo')
									.ok('Ok')	
							);
						}
					}
				})
				.
				error(function(error) {
					console.log(data, error);
					messageService.showMessage('Error impossible to make http call', 'error', 'Error');		
				});
			}
			else{
				$mdDialog.show(
					$mdDialog.alert()
						.parent(angular.element(document.querySelector('#mainContainer')))
						.clickOutsideToClose(true)
						.title('Save file')
						.textContent('Attention!'+msg)
						.ariaLabel('Alert Dialog Demo')
						.ok('Ok')	
				);
			}
        };
		
		//function for delete the json file
		$scope.deleteFile = function(id) {	
			var confirm = $mdDialog.confirm()
			.title('Delete file')
			.textContent('Are you sure?')
			.ok('Yes')
			.cancel('Cancel');

			$mdDialog.show(confirm).then(function() {
				//YES
				$http({
					method  : 'POST',
					url     : 'script/delete_file.php',
					data    : id,
					headers : {'Content-Type': 'application/x-www-form-urlencoded'}
				})
				.success(function(data) {
					if (data == "KO") {
						alert("KO");
					} else {
						$scope.fillFileList();
						$mdDialog.show(
							$mdDialog.alert()
								.parent(angular.element(document.querySelector('#mainContainer')))
								.clickOutsideToClose(true)
								.title('Delete file')
								.textContent('Success!')
								.ariaLabel('Alert Dialog Demo')
								.ok('Ok')	
						);
					}
				})
				.
				error(function() {
					messageService.showMessage('Error impossible to make http call', 'error', 'Error');	
				});
			});
        };
		
		//get file info
		$scope.getFileInfo = function(id, fx) {	
			$http({
				method  : 'POST',
				url     : 'script/get_file_info.php',
				data    : id,
				headers : {'Content-Type': 'application/x-www-form-urlencoded'}
			})
			.success(function(data) {
				if (data == "KO") {
					alert("KO");
				} else {
					fx(data);
				}
			})
			.
			error(function() {
				messageService.showMessage('Error impossible to make http call', 'error', 'Error');	
			});
			
        };
			
		//function for launch demo
		$scope.launchDemo = function (id) {	
			$scope.getFileInfo(id, function(data){
				$scope.file_options.filename = data.filename;
				$scope.show('demo');
			});
		};
		
		//function for upload object
		//upload logo
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
					$scope.active_file.header.image.src = file.name;
				});
			}   
		};
		
		
		//FORM FUNCTIONS
		$scope.option_visibility = false;
		$scope.head_visibility = false;
		$scope.logos_visibility = false;
		$scope.menu_visibility = false;
		$scope.containers_visibility = false;
		$scope.layout_visibility = false;
		$scope.footer_visibility = false;
		
		//OPTION form function
		$scope.showOption = function () {	//function for hide and show the option form
			if($scope.option_visibility == true){
				$scope.option_visibility = false;
			}
			else{
				$scope.option_visibility = true;
			}
		};
		
		
		//HEADER form function
		$scope.showHeader = function () {	//function for hide and show the header form
			if($scope.head_visibility == true){
				$scope.head_visibility = false;
			}
			else{
				$scope.head_visibility = true;
			}
		};
		
		//demo header dialog
		/********************************************/
		$scope.showDemoHeaderDialog = function(ev) { 
			$mdDialog.show({  
				locals:{header_type: $scope.active_file.header.type},
				controller: DemoHeaderController,
				templateUrl: 'components/header/demoHeaderDialog.html',
				parent: angular.element(document.body),
				targetEvent: ev,
				clickOutsideToClose:true,
				fullscreen: false
			});
		};
		
		//container dialog controller
		function DemoHeaderController($scope, $mdDialog, locals) { 
			$scope.locals = locals;
			$scope.choices = {};
			
			$scope.hide = function() {
				$mdDialog.hide();
			};

			$scope.cancel = function() {
				$mdDialog.cancel();
			};
		}
		/*******************************************/
		
		//logos function
		$scope.showLogos = function () {	//function for hide and show the header form
			if($scope.logos_visibility == true){
				$scope.logos_visibility = false;
			}
			else{
				$scope.logos_visibility = true;
			}
		};
		
		$scope.addLogo = function () {
			$scope.active_file.header.logos.push({"image" : ""});
		};

		/*** generic function for delete element ***/
		$scope.showDeleteDialog = function (message, array, index) {	
			var confirm = $mdDialog.confirm()
			.title('Delete')
			.textContent(message)
			.ok('Yes')
			.cancel('Cancel');

			$mdDialog.show(confirm).then(function() {	
				array.splice(index, 1);
			})
		};
			
		$scope.deleteElement = function (array, index) {	
				array.splice(index, 1);
		};
		/*****************************************/
		
		//MENU form function
		$scope.showMenu = function () {	//function for hide and show the menu form
			if($scope.menu_visibility == true){
				$scope.menu_visibility = false;
			}
			else{
				$scope.menu_visibility = true;
			}
		};
		
		$scope.addMenuItem = function () {	
			$scope.active_file.menu.elements.push({"name" : "", "url" : "#","submenu" : []});
		};
		
		$scope.addMenuSubItem = function (index) {	
			var m_item = $scope.active_file.menu.elements[index];
			m_item.submenu.push({"name" : "", "url" : "#"});
		};	
		
		
		//CONTAINERS form function
		$scope.showContainers = function () {	//function for hide and show the containers form
			if($scope.containers_visibility == true){
				$scope.containers_visibility = false;
			}
			else{
				$scope.containers_visibility = true;
			}
		};
		
		$scope.container_list = [];
		
		$scope.createContainerList = function(){
			$scope.container_list = [];
			$scope.active_file.menu.elements.forEach( function (item)
			{
				if(!$scope.checkUrl(item.url) && item.url != '#'){
					$scope.container_list.push(item);
				}
				
				if(item.submenu.length > 0){
					item.submenu.forEach( function (subitem)
					{
						if(!$scope.checkUrl(subitem.url) && subitem.url != '#'){
							$scope.container_list.push(subitem);
						}
					});
				}
			});
			$scope.container_list.sort();
			//console.log($scope.container_list);
		};
		
		$scope.checkUrl = function(url){
			var urlRegex = "(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9]\.[^\s]{2,})";
			var pattern = new RegExp(urlRegex, 'i');
			if (pattern.test(url)) {
				return true;
			} else{
				return false;
			}            
		};
		
		$scope.showAddContainerDialog = function(ev) { //function for open the "add container" dialog
			$mdDialog.show({
				locals:{container_list: $scope.container_list},   
				controller: ContainerDialogController,
				templateUrl: 'components/container/addContainerDialog.html',
				parent: angular.element(document.body),
				targetEvent: ev,
				clickOutsideToClose:true,
				fullscreen: false
			})
			.then(function(answer) {
				if(answer.container){ //existing page
				
			
					//console.log(answer);
				
					layoutService.addContainer(answer.container.name,answer.container.url); //add container to container list and create the empty layout
				}
				else if(answer.new_container){ //new page
					layoutService.addContainer(answer.new_container, "");	//add container to container list and create the empty layout	
				}
				else{ //no page selected
					$mdDialog.show(
						$mdDialog.alert()
							.parent(angular.element(document.querySelector('#mainContainer')))
							.clickOutsideToClose(true)
							.title('Add container')
							.textContent('The container name is required')
							.ariaLabel('Alert Dialog Demo')
							.ok('Ok')	
					);
				}
			});
		};
		
		//container dialog controller
		function ContainerDialogController($scope, $mdDialog, locals) { 
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
		
		$scope.showDeleteContainerDialog = function (message, array, index) {	//function for delete the container and its layout
			var confirm = $mdDialog.confirm()
			.title('Delete')
			.textContent(message)
			.ok('Yes')
			.cancel('Cancel');

			$mdDialog.show(confirm).then(function() {	
				layoutService.deleteContainer(index);
			})
		};
		
		//LAYOUT form function
		$scope.showLayout = function () {	//function for hide and show the layout form
			if($scope.layout_visibility == true){
				$scope.layout_visibility = false;
			}
			else{
				$scope.layout_visibility = true;
			}
		};
		
		
		$scope.showGridDeleteDialog = function (message, grid, list, index) {	
			var confirm = $mdDialog.confirm()
			.title('Delete Grid')
			.textContent(message)
			.ok('Yes')
			.cancel('Cancel');

			$mdDialog.show(confirm).then(function() {	
				
				//console.log(list);
				
				list.splice(index, 1);
				
				for(var i = 0; i < grid.columns.length; i++){
																
					for(var j = 0; j < grid.columns[i].length; j++){
						//var item = grid.columns[i].splice(j,1);
						list.push(grid.columns[i][j]);
					}
					//console.log(list);
				}
			})
		};
		
		
		//FOOTER form function
		$scope.showFooter = function () {	//function for hide and show the header form
			if($scope.footer_visibility == true){
				$scope.footer_visibility = false;
			}
			else{
				$scope.footer_visibility = true;
			}
		};
		
		//VARIABLES form function
		$scope.addVariable = function () {	
			$scope.active_file.variables.variables_list.push({"key" : "", "default_value" : ""});
		};
		
		//CHECK required field
		$scope.checkRequiredField = function () {	//function for hide and show the option form
			var msg = '';
			
			if($scope.file_options.filename == undefined || $scope.file_options.filename == ""){
				msg += 'The filename is required';
			}
			
			if($scope.file_options.owner == undefined || $scope.file_options.owner == ""){
				msg += 'The owner name is required';
			}
			
			if($scope.active_file.header.title == undefined || $scope.active_file.header.title == ""){
				msg += 'The title inside header is required';
			}
			
			return msg;
		};

		//LAYOUT form function
		$scope.getContainerName = function (id) {	
			return layoutService.getContainerName(id);
		};
		
		$scope.getElementName = function (id) {	
			return layoutService.getElementName(id);
		};
		
	});