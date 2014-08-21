var APP = angular.module("app", [ 'ngRoute', 'LocalStorageModule']);
APP.config(function($routeProvider) {
	$routeProvider
	.when('/', {
		templateUrl : "template/welcome.html",
	})
	.when('/:type', {
		templateUrl : "template/welcome.html",
	})
});
function alert2(object) {
	var out = JSON.stringify(object);
	alert(out);
}
function buildButton(text, shortcuts, keyboard, onclick){
	var button = {
		text 		: text,
		shortcuts 	: shortcuts,
		onclick 	: onclick
	};
	if (keyboard){
		angular.forEach(shortcuts, function(shortcut, key) {
			if (!keyboard[shortcut]){
				keyboard[shortcut] = [];
			}
			keyboard[shortcut].push(button);
		});
	}
	return button;
}
function buildOperationButton(text, shortcuts, keyboard, calculator, execute){
	var operation = {
		symbol	: text,
		execute	: execute
	}
	var button = buildButton(text, shortcuts, keyboard, function (){
		 calculator.pushOperation(operation);
	});
	
	return button;
}
APP.factory('numFactory', function() {
	return function(number, calculator, keyboard){
		if (number > 9){
			number = String.fromCharCode("A".charCodeAt(0) + (number - 9));
		}
		return buildButton(number, [96 + number, 48 + number], keyboard, function (){
				if (calculator.value === '0'){
					calculator.value = number + '';
					return;
				}
				calculator.value += number + '';
		});
	}
});
APP.factory('numpadFactory', ['numFactory',  function(numFactory) {
	return {
		getNumbPads : function (base, calculator, keyboard){
			var pads = [];
			for(var i = 1; i < base; i++){
				pads.push(numFactory(i, calculator, keyboard));
			}
			pads.push(numFactory(0, calculator, keyboard));
			return pads;	
		}
	};
}]);
APP.factory('basicFactory', ['numpadFactory', function(numpadFactory) {
	return {
		build : function (type, keyboard){
			var calculator = {
				result		: [],
				sign 			: '',
				value 		: '0',
				base			: 10,
				operation 	: {},
				components 	: {},
				getValue		: function(){
					return parseFloat(this.sign + this.value);	
				},
				setValue		: function(value){
					if (value < 0){
						this.sign = '-';
						value = value * -1;
					}
					this.value = value + '';
				},
				pushOperation: function (operation){
					console.log(operation);
					this.result.push(this.getValue());
					if (this.operation){
						if (this.result.length > 1){
							this.operation.execute(this.result[0], this.result[1], function (err, value){
								if (!err){
									calculator.result = [value];
									return;
								}
								console.log(err);
								calculator.result = [];
								calculator.message = err.message;
							});
						}
					}
					this.value = '0';
					this.operation = operation;
				}
			};
			calculator.components["numbers"] = numpadFactory.getNumbPads(10, calculator, keyboard);
			calculator.components["operations"] = [
				buildOperationButton('+', [107, 187], keyboard, calculator, function (a, b, next){
					next(null, a + b);
				}),
				buildOperationButton('-', [109, 189], keyboard, calculator, function (a, b, next){
					next(null, a - b);
				}),
				buildOperationButton('*', [106], keyboard, calculator, function (a, b, next){
					next(null, a * b);
				}),
				buildOperationButton('/', [111, 191], keyboard, calculator, function (a, b, next){
					if (b == 0){
						next({ message : 'cannot divide by zero'})
						return;
					}
					next(null, a / b);
				}),
			];
			calculator.components["commands"] = [
				buildButton('.', [190, 110], keyboard, function (){
					if (calculator.value.indexOf(".") == -1){
						calculator.value += '.';
   				}
				}),
				buildButton('-/+', [], keyboard, function (){
					if (calculator.sign == '-'){
						calculator.sign = '';
   				} else {
   					calculator.sign = '-';
   				}
				}),
				buildButton('del', [46], keyboard, function (){
					if (calculator.value == '0'){
						calculator.result = [];
						calculator.operation = null;
					} else {
						calculator.sign = '';
						calculator.value = '0';
					}
				}),
				buildButton('C', [46], keyboard, function (){
					calculator.sign = '';
					calculator.value = '0';
				}),
				buildButton('=', [13], keyboard, function (){
					if (calculator.operation){
						calculator.pushOperation();
					}
				}),
			];
			if (type === 'scientific'){
				calculator.components["operations"].push(buildButton('sin', [], keyboard, function (){
					calculator.setValue(Math.sin(calculator.getValue()));
				}));
				calculator.components["operations"].push(buildButton('cos', [], keyboard, function (){
					calculator.setValue(Math.cos(calculator.getValue()));
				}));
				calculator.components["operations"].push(buildButton('tan', [], keyboard, function (){
					calculator.setValue(Math.tan(calculator.getValue()));
				}));
				calculator.components["operations"].push(buildOperationButton('^', [], keyboard, calculator, function (a, b, next){
					next(null, Math.pow(a, b));
				}));
				calculator.components["operations"].push(buildButton('sqrt', [], keyboard, function (){
					if (calculator.getValue() < 0){
						calculator.message = 'Invalid operation';
						return;
					}
					calculator.setValue(Math.sqrt(calculator.getValue()));
				}));
			}
			return calculator;
		},
		
	};
}]);
APP.controller('mainController', ['$scope', '$http', 'localStorageService', '$rootScope', '$location', '$routeParams', '$filter', 'basicFactory',
    function($scope, $http, storage, $rootScope, $location, $routeParams, $filter, basicFactory) {
    	
   // 	$scope.numbers = [];
   // 	$scope.calculator = {
   // 		value 		: '0',
   // 		result		: [],
   // 		operation 	: [],
   // 		click 	: function (number){
   // 			this.value = this.value * 10 + number;
   // 		},
   // 		operate : function (operation){
   // 			this.result.push(parseFloat(this.value));
   // 			if (this.result.length > 1){
   // 				this.value = this.operation.calculate(this.result.pop(), this.result.pop());
   // 				this.result.push(this.value);
   // 			}
   // 			this.operation = operation;
   // 			this.value = '0';
   // 		},
   // 		last	: function(){
   // 			if (this.result.length < 1){
   // 				return 0;
   // 			}
   // 			return this.result[1];
   // 		}
   // 	};
    	
   // 	$scope.groups = [[], [], []];
   // 	$scope.numbers = [];
   // 	for(var i = 0; i < 10; i++){
			// $scope.groups[0].push({
			// 	symbol 		: i,
			// 	keycodes 	: [96 + i, 48 + i],
			// 	calculator	: $scope.calculator,
			// 	onclick 	: function (){
			// 		if (this.calculator.value === '0'){
			// 			this.calculator.value = this.symbol + '';
			// 			return;
			// 		}
			// 		this.calculator.value += this.symbol + '';
			// 	}
			// });
   // 	}
   // 	$scope.groups[1].push({
   // 		symbol		: '.',
   // 		keycodes 	: [190, 110],
   // 		onclick   	: function (){
   // 			if ($scope.calculator.value.indexOf(".") == -1){
   // 				$scope.calculator.value += '.';
   // 			}
   // 		}
   // 	});
   // 	$scope.groups[1].push({
   // 		symbol		: 'C',
   // 		keycodes 	: [8, 46],
   // 		onclick   	: function (){
   // 			$scope.calculator.value = '0';
   // 		}
   // 	});
    	
   // 	$scope.groups[2].push({
   // 		symbol		: '+',
   // 		keycodes 	: [107, 187],
   // 		calculate 	: function (a, b){
   // 			 return a + b;
   // 		},
   // 		onclick   	: function (){
   // 			$scope.calculator.operate(this);
   // 		}
   // 	});
   // 	$scope.groups[2].push({
   // 		symbol		: '-',
   // 		keycodes 	: [109, 189],
   // 		calculate 	: function (a, b){
   // 			 return b - a;
   // 		},
   // 		onclick   	: function (){
   // 			$scope.calculator.operate(this);
   // 		}
   // 	});
   // 	$scope.groups[2].push({
   // 		symbol		: '*',
   // 		keycodes 	: [106],
   // 		calculate 	: function (a, b){
   // 			 return a * b;
   // 		},
   // 		onclick   	: function (){
   // 			$scope.calculator.operate(this);
   // 		}
   // 	});
   // 	$scope.groups[2].push({
   // 		symbol		: '/',
   // 		keycodes 	: [111, 191],
   // 		calculate 	: function (a, b){
   // 			 return b / a;
   // 		},
   // 		onclick   	: function (){
   // 			$scope.calculator.operate(this);
   // 		}
   // 	});
   // 	$scope.groups[2].push({
   // 		symbol		: '=',
   // 		keycodes 	: [13],
   // 		calculate 	: function (a, b){
   // 			 return a;
   // 		},
   // 		onclick   	: function (){
   // 			$scope.calculator.operate(this);
   // 		}
   // 	});
  	$rootScope.keyupObservers = [];
  	$scope.keyup = function(event) {
		angular.forEach($rootScope.keyupObservers , function(observer, index) {
			if (observer){
				observer(event);
			}
		});
  	};
}]);

APP.controller('calculatorController', ['$scope', '$routeParams', 'basicFactory', '$rootScope',
	function($scope, $routeParams, basicFactory, $rootScope) {
		console.log($routeParams);
    	$scope.type = $routeParams.type;
    	$scope.keyboard = {};
    	$scope.keyup = function(event) {
    		console.log('keycode : ' + event.keyCode);
      		if ($scope.keyboard[event.keyCode]){
      			angular.forEach($scope.keyboard[event.keyCode] , function(observer, index) {
      				observer.onclick();
      			});
      		}
  		};
  		$rootScope.keyupObservers.push($scope.keyup);
    	$scope.calculator = basicFactory.build($scope.type, $scope.keyboard);
	}]);