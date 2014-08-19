var APP = angular.module("app", [ 'ngRoute', 'LocalStorageModule']);
APP.config(function($routeProvider) {
	$routeProvider
	.when('/', {
		templateUrl : "template/welcome.html",
		controller : 'mainController'
	})
});
function alert2(object) {
	var out = JSON.stringify(object);
	alert(out);
}

APP.controller('mainController', ['$scope', '$http', 'localStorageService', '$rootScope', '$location', '$routeParams', '$filter',
    function($scope, $http, storage, $rootScope, $location, $routeParams, $filter) {
    	$scope.numbers = [];
    	$scope.history = {
    		value 		: 0,
    		result		: [],
    		operations 	: [],
    		click 	: function (number){
    			this.value = this.value * 10 + number;
    		},
    		operate : function (operation){
    			this.result.push(this.value);
    			this.operations.push(operation);
    			if (this.result.length > 1){
    				this.value = operation.calculate(this.result.pop(), this.result.pop());
    				this.result.push(this.value);
    			}
    			this.value = 0;
    		},
    		last	: function(){
    			if (this.result.length < 1){
    				return 0;
    			}
    			return this.result[this.result.length - 1];
    		}
    	};
    	
    	$scope.buttons = [];
    	for(var i = 0; i < 10; i++){
			$scope.buttons.push({
				symbol 		: i,
				keycodes 	: [96 + i, 48 + i],
				onclick 	: function (){
					$scope.history.click(this.symbol);
				}
			});
    	}
    	
    	$scope.buttons.push({
    		symbol		: '+',
    		keycodes 	: [107, 187],
    		calculate 	: function (a, b){
    			 return a + b;
    		},
    		onclick   	: function (){
    			$scope.history.operate(this);
    		}
    	});
    	
    	$scope.keyHandler = {};
    	$scope.keyup = function(event) {
      		if ($scope.keyHandler[event.keyCode]){
      			$scope.keyHandler[event.keyCode].onclick();
      		}
  		};
    	angular.forEach($scope.buttons, function(button, key) {
    		angular.forEach(button.keycodes , function(keycode, index) {
    			$scope.keyHandler[keycode] = button;
    		});
    	});
}]);