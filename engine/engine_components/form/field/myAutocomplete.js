app.directive("myAutocomplete", function() { 
	return { 
		restrict: "E", 
		scope: { 
			myElement: "=",
			myValue: "="
		},
		controller :function MyAutocompleteController($scope, $q, $log, $timeout) {
			
            $scope.isDisabled    = false;
            
            $scope.elem = $scope.myElement.elements;  // list of elements to be displayed
            $scope.querySearch   = querySearch;
            $scope.selectedItemChange = selectedItemChange;

            function querySearch (query) {
				var results = query ? $scope.elem.filter( createFilterFor(query) ) : $scope.elem;
                  
				return results;
				
            }
                      
            function selectedItemChange(item) { //function call when the value in select field change
                $scope.myValue = item.value;
			}
            
           
            //filter function for search query
            function createFilterFor(query) {
				return function filterFn(elem) {
					return (elem.name.indexOf(query) === 0);
				};
            }			
		},
		templateUrl: "engine/engine_components/form/field/myAutocomplete.html"			
	}; 
});

