'use strict';

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
  it('Add sin(2)', function () {
    clickButton(scope.calculator.components, '2');
    clickButton(scope.calculator.components, 'sin');
    //scope.calculator.components[]
    expect(scope.calculator.getValue()).toBe(Math.sin(2));
  });
  it('Add cos(2)', function () {
    clickButton(scope.calculator.components, 'del');
    clickButton(scope.calculator.components, '2');
    clickButton(scope.calculator.components, 'cos');
    expect(scope.calculator.getValue()).toBe(Math.cos(2));
  });
  
  it('Add 6!= 120', function () {
    clickButton(scope.calculator.components, 'del');
    clickButton(scope.calculator.components, '6');
    clickButton(scope.calculator.components, 'n!');
    expect(scope.calculator.getValue()).toBe(120);
  });
  
  it('Add 2 ^ 10 = 1024', function () {
    clickButton(scope.calculator.components, 'del');
    clickButton(scope.calculator.components, '2');
    clickButton(scope.calculator.components, '^');
    clickButton(scope.calculator.components, '1');
    clickButton(scope.calculator.components, '0');
    clickButton(scope.calculator.components, '=');
    expect(scope.calculator.result[0]).toBe(1024);
  });
});
