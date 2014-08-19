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
    	$scope.calculator = {
    		value 		: 0,
    		result		: [],
    		operations 	: [],
    		click 	: function (number){
    			this.value = this.value * 10 + number;
    		},
    		operate : function (operation){
    			this.result.push(this.value);
    			if (this.result.length > 1){
    				this.value = this.operations.pop().calculate(this.result.pop(), this.result.pop());
    				this.result.push(this.value);
    			}
    			this.operations.push(operation);
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
					$scope.calculator.click(this.symbol);
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
    			$scope.calculator.operate(this);
    		}
    	});
    	$scope.buttons.push({
    		symbol		: '-',
    		keycodes 	: [109, 189],
    		calculate 	: function (a, b){
    			 return b - a;
    		},
    		onclick   	: function (){
    			$scope.calculator.operate(this);
    		}
    	});
    	$scope.buttons.push({
    		symbol		: '*',
    		keycodes 	: [106],
    		calculate 	: function (a, b){
    			 return a * b;
    		},
    		onclick   	: function (){
    			$scope.calculator.operate(this);
    		}
    	});$scope.buttons.push({
    		symbol		: '/',
    		keycodes 	: [111, 191],
    		calculate 	: function (a, b){
    			 return b / a;
    		},
    		onclick   	: function (){
    			$scope.calculator.operate(this);
    		}
    	});
    	
    	$scope.keyHandler = {};
    	$scope.keyup = function(event) {
    		console.log(event.keyCode);
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