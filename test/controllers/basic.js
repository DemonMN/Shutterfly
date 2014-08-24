'use strict';

describe('Controller: mainController', function () {
  
  // load the controller's module
  beforeEach(module('app'));
  
  var mainCtrl, scope;
  
  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
      scope = $rootScope.$new();
      mainCtrl = $controller('mainController', {
        $scope: scope,
      });
  }));
  
  it('default page', function () {
    expect(scope.keyupObservers).toBeDefined();
  });
});

describe('Controller: calculatorController', function () {
  
  // load the controller's module
  beforeEach(module('app'));
  
  var calculatorController, scope;
  
  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
      $rootScope.keyupObservers = [];
      scope = $rootScope.$new();
      calculatorController = $controller('calculatorController', {
        $routeParams: {type : 'scientific'},
        $scope: scope
      });  
  }));
  
  it('The calculator should be defined', function () {
    expect(scope.calculator).toBeDefined();
  });
  it('The calculator value be 0', function () {
    expect(scope.calculator.value).toBe('0');
  });
  function clickButton(components, text){
    angular.forEach(components, function(group, index) {
      angular.forEach(group, function(component, index) {
        
        if (component.text == text){
          component.onclick();
          
        }
      });
    });
  }
  it('Type 123', function () {
    clickButton(scope.calculator.components, '1');
    clickButton(scope.calculator.components, '2');
    clickButton(scope.calculator.components, '3');
    //scope.calculator.components[]
    expect(scope.calculator.value).toBe('123');
  });
  it('Type 123.1', function () {
    clickButton(scope.calculator.components, '1');
    clickButton(scope.calculator.components, '2');
    clickButton(scope.calculator.components, '3');
    clickButton(scope.calculator.components, '.');
    clickButton(scope.calculator.components, '1');
    //scope.calculator.components[]
    expect(scope.calculator.value).toBe('123.1');
  });
  it('Add 2 + 3 = 5', function () {
    clickButton(scope.calculator.components, '2');
    clickButton(scope.calculator.components, '+');
    clickButton(scope.calculator.components, '3');
    clickButton(scope.calculator.components, '=');
    //scope.calculator.components[]
    expect(scope.calculator.result[0]).toBe(5);
  });
  it('Add -2 + 5 = 3', function () {
    clickButton(scope.calculator.components, 'del');
    clickButton(scope.calculator.components, '-/+');
    clickButton(scope.calculator.components, '2');
    clickButton(scope.calculator.components, '-');
    clickButton(scope.calculator.components, '5');
    clickButton(scope.calculator.components, '+');
    expect(scope.calculator.result[0]).toBe(3);
  });
  
  it('Add 22 * 45 + 12 = 1002', function () {
    clickButton(scope.calculator.components, 'del');
    clickButton(scope.calculator.components, '');
    clickButton(scope.calculator.components, '2');
    clickButton(scope.calculator.components, '2');
    clickButton(scope.calculator.components, '*');
    clickButton(scope.calculator.components, '4');
    clickButton(scope.calculator.components, '5');
    clickButton(scope.calculator.components, '+');
    clickButton(scope.calculator.components, '1');
    clickButton(scope.calculator.components, '2');
    clickButton(scope.calculator.components, '=');
    expect(scope.calculator.result[0]).toBe(1002);
  });
  
  it('Add 12 / 3 + 5 = 9', function () {
    clickButton(scope.calculator.components, 'del');
    clickButton(scope.calculator.components, '');
    clickButton(scope.calculator.components, '1');
    clickButton(scope.calculator.components, '2');
    clickButton(scope.calculator.components, '/');
    clickButton(scope.calculator.components, '3');
    clickButton(scope.calculator.components, '+');
    clickButton(scope.calculator.components, '5');
    clickButton(scope.calculator.components, '=');
    expect(scope.calculator.result[0]).toBe(9);
  });
});
