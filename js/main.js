var APP = angular.module("app", [ 'ngRoute', 'LocalStorageModule']);
APP.config(function($routeProvider) {
	$routeProvider
	.when('/', {
		templateUrl : "template/welcome.html",
	})
	.when('/:type', {
		templateUrl : "template/welcome.html",
	});
});
function alert2(object) {
	var out = JSON.stringify(object);
	alert(out);
}
APP.filter('decimal', function () {
		return function (text, length) {
			if (!text){
				return '';
			}
			if (isNaN(text)){
				text = text + '';
			}
	    	var arr = text.split(".");
	        return arr[0].replace(/\d(?=(\d{3})+($))/g, "$&'") + (arr.length > 1 ? '.' + arr[1] : '');
		};
	});
APP.directive('animateOnChange', function($animate) {
	return function(scope, elem, attr) {
		scope.$watch(attr.animateOnChange, function(value, old) {
			if (value != old) {
				var c = value > old ? 'change-up' : 'change';
				scope[attr.animateOnChange] = '';
				scope.$apply();
				$animate.addClass(elem, c);
			}
		});
	};
});
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
				if (calculator.value.length == 72){
					return;
				}
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
						calculator.pushOperation(calculator.operation);
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
				calculator.components["operations"].push(buildButton('log', [], keyboard, function (){
					calculator.setValue(Math.log(calculator.getValue()));
				}));
				calculator.components["operations"].push(buildButton('n!', [], keyboard, function (){
					var n = calculator.getValue();
					if (n % 1 === 0 && n > 0 && n < 1000){
						var value = 1;
						for(var i = 2; i < n; i++) 
							value *= i;
						calculator.setValue(isFinite(value) ? value : 0);
					}
					
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